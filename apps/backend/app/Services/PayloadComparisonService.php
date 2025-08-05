<?php

namespace App\Services;

/**
 * Service for comparing JSON payloads and detecting differences
 *
 * This service provides sophisticated comparison logic for product data,
 * with special handling for nested structures like images and variants.
 */
class PayloadComparisonService
{
    /**
     * Compare two payloads and return structured differences
     *
     * @param  array  $payload1  First payload
     * @param  array  $payload2  Second payload
     * @return array Comparison result with differences
     */
    public function compare(array $payload1, array $payload2): array
    {
        $differences = [];

        // Compare the payloads recursively
        $this->compareRecursive($payload1, $payload2, '', $differences);

        // Calculate summary statistics
        $summary = [
            'added' => count(array_filter($differences, fn ($diff) => $diff['type'] === 'added')),
            'removed' => count(array_filter($differences, fn ($diff) => $diff['type'] === 'removed')),
            'modified' => count(array_filter($differences, fn ($diff) => $diff['type'] === 'modified')),
        ];

        return [
            'hasChanges' => ! empty($differences),
            'differences' => $differences,
            'summary' => $summary,
        ];
    }

    /**
     * Recursively compare two arrays/objects
     *
     * @param  mixed  $value1  Value from first payload
     * @param  mixed  $value2  Value from second payload
     * @param  string  $path  Current path in the structure
     * @param  array  &$differences  Array to collect differences
     */
    private function compareRecursive($value1, $value2, string $path, array &$differences): void
    {
        // Handle null values
        if ($value1 === null && $value2 !== null) {
            $differences[] = [
                'type' => 'added',
                'path' => $path,
                'oldValue' => null,
                'newValue' => $value2,
                'message' => "Added value at {$path}",
            ];

            return;
        }

        if ($value1 !== null && $value2 === null) {
            $differences[] = [
                'type' => 'removed',
                'path' => $path,
                'oldValue' => $value1,
                'newValue' => null,
                'message' => "Removed value at {$path}",
            ];

            return;
        }

        // Handle different types
        if (gettype($value1) !== gettype($value2)) {
            $differences[] = [
                'type' => 'modified',
                'path' => $path,
                'oldValue' => $value1,
                'newValue' => $value2,
                'message' => "Type changed at {$path} from ".gettype($value1).' to '.gettype($value2),
            ];

            return;
        }

        // Handle arrays
        if (is_array($value1) && is_array($value2)) {
            $this->compareArrays($value1, $value2, $path, $differences);

            return;
        }

        // Handle scalar values
        if ($value1 !== $value2) {
            $differences[] = [
                'type' => 'modified',
                'path' => $path,
                'oldValue' => $value1,
                'newValue' => $value2,
                'message' => $this->generateChangeMessage($path, $value1, $value2),
            ];
        }
    }

    /**
     * Compare two arrays with special handling for different structures
     *
     * @param  array  $array1  First array
     * @param  array  $array2  Second array
     * @param  string  $path  Current path
     * @param  array  &$differences  Array to collect differences
     */
    private function compareArrays(array $array1, array $array2, string $path, array &$differences): void
    {
        // Check if arrays are indexed (variants, images, etc.) or associative
        $isIndexed1 = array_is_list($array1);
        $isIndexed2 = array_is_list($array2);

        if ($isIndexed1 && $isIndexed2) {
            $this->compareIndexedArrays($array1, $array2, $path, $differences);
        } else {
            $this->compareAssociativeArrays($array1, $array2, $path, $differences);
        }
    }

    /**
     * Compare indexed arrays (like variants, images)
     *
     * @param  array  $array1  First indexed array
     * @param  array  $array2  Second indexed array
     * @param  string  $path  Current path
     * @param  array  &$differences  Array to collect differences
     */
    private function compareIndexedArrays(array $array1, array $array2, string $path, array &$differences): void
    {
        $maxLength = max(count($array1), count($array2));

        for ($i = 0; $i < $maxLength; $i++) {
            $currentPath = $path ? "{$path}[{$i}]" : "[{$i}]";

            $exists1 = isset($array1[$i]);
            $exists2 = isset($array2[$i]);

            if ($exists1 && ! $exists2) {
                $differences[] = [
                    'type' => 'removed',
                    'path' => $currentPath,
                    'oldValue' => $array1[$i],
                    'newValue' => null,
                    'message' => "Removed item at index {$i} in {$path}",
                ];
            } elseif (! $exists1 && $exists2) {
                $differences[] = [
                    'type' => 'added',
                    'path' => $currentPath,
                    'oldValue' => null,
                    'newValue' => $array2[$i],
                    'message' => "Added item at index {$i} in {$path}",
                ];
            } elseif ($exists1 && $exists2) {
                $this->compareRecursive($array1[$i], $array2[$i], $currentPath, $differences);
            }
        }
    }

    /**
     * Compare associative arrays (like product objects)
     *
     * @param  array  $array1  First associative array
     * @param  array  $array2  Second associative array
     * @param  string  $path  Current path
     * @param  array  &$differences  Array to collect differences
     */
    private function compareAssociativeArrays(array $array1, array $array2, string $path, array &$differences): void
    {
        $allKeys = array_unique(array_merge(array_keys($array1), array_keys($array2)));

        foreach ($allKeys as $key) {
            $currentPath = $path ? "{$path}.{$key}" : $key;

            $exists1 = array_key_exists($key, $array1);
            $exists2 = array_key_exists($key, $array2);

            if ($exists1 && ! $exists2) {
                $differences[] = [
                    'type' => 'removed',
                    'path' => $currentPath,
                    'oldValue' => $array1[$key],
                    'newValue' => null,
                    'message' => "Removed property '{$key}'",
                ];
            } elseif (! $exists1 && $exists2) {
                $differences[] = [
                    'type' => 'added',
                    'path' => $currentPath,
                    'oldValue' => null,
                    'newValue' => $array2[$key],
                    'message' => "Added property '{$key}'",
                ];
            } elseif ($exists1 && $exists2) {
                $this->compareRecursive($array1[$key], $array2[$key], $currentPath, $differences);
            }
        }
    }

    /**
     * Generate a human-readable change message
     *
     * @param  string  $path  The path where change occurred
     * @param  mixed  $oldValue  Old value
     * @param  mixed  $newValue  New value
     * @return string Human-readable message
     */
    private function generateChangeMessage(string $path, $oldValue, $newValue): string
    {
        // Special messages for common e-commerce fields
        if (str_contains($path, 'price')) {
            return "Price changed from {$oldValue} to {$newValue}";
        }

        if (str_contains($path, 'inventory_quantity')) {
            return "Inventory quantity changed from {$oldValue} to {$newValue}";
        }

        if (str_contains($path, 'sku')) {
            return "SKU changed from '{$oldValue}' to '{$newValue}'";
        }

        if (str_contains($path, 'barcode')) {
            return "Barcode changed from '{$oldValue}' to '{$newValue}'";
        }

        if (str_contains($path, 'url')) {
            return "URL changed from '{$oldValue}' to '{$newValue}'";
        }

        if (str_contains($path, 'title')) {
            return "Title changed from '{$oldValue}' to '{$newValue}'";
        }

        if (str_contains($path, 'position')) {
            return "Position changed from {$oldValue} to {$newValue}";
        }

        // Generic message
        return "Value changed from '{$oldValue}' to '{$newValue}' at {$path}";
    }
}
