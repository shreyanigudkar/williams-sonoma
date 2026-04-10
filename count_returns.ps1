$items = Import-Csv "dataset/Order_items.csv"
$returns = Import-Csv "dataset/Returns.csv"
Write-Host "Items: $($items.Count)"
Write-Host "Returns: $($returns.Count)"
$rate = [math]::Round(($returns.Count / $items.Count) * 100, 1)
Write-Host "Return rate: $rate%"
