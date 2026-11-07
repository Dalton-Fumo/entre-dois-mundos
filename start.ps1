# ============================================================
#  Pré-visualização local do site
#  Uso:  clique direito > "Executar com PowerShell"
#        ou:  powershell -ExecutionPolicy Bypass -File start.ps1
# ============================================================
param(
  [int]$Port = 5500,
  [switch]$NoBrowser
)

$ErrorActionPreference = "Stop"
$root = $PSScriptRoot
if (-not $root) { $root = (Get-Location).Path }
$root = [System.IO.Path]::GetFullPath($root)

$prefix = "http://localhost:$Port/"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)

try {
  $listener.Start()
} catch {
  Write-Host ""
  Write-Host "Nao foi possivel abrir o porto $Port." -ForegroundColor Red
  Write-Host "Experimenta outro porto:  powershell -ExecutionPolicy Bypass -File start.ps1 -Port 5501"
  Write-Host ""
  exit 1
}

$mime = @{
  ".html" = "text/html; charset=utf-8"
  ".htm"  = "text/html; charset=utf-8"
  ".css"  = "text/css; charset=utf-8"
  ".js"   = "application/javascript; charset=utf-8"
  ".json" = "application/json; charset=utf-8"
  ".yml"  = "text/yaml; charset=utf-8"
  ".yaml" = "text/yaml; charset=utf-8"
  ".md"   = "text/markdown; charset=utf-8"
  ".txt"  = "text/plain; charset=utf-8"
  ".xml"  = "application/xml; charset=utf-8"
  ".svg"  = "image/svg+xml"
  ".png"  = "image/png"
  ".jpg"  = "image/jpeg"
  ".jpeg" = "image/jpeg"
  ".webp" = "image/webp"
  ".gif"  = "image/gif"
  ".ico"  = "image/x-icon"
  ".pdf"  = "application/pdf"
  ".woff" = "font/woff"
  ".woff2"= "font/woff2"
}

Write-Host ""
Write-Host "  UMA VOZ ENTRE DOIS MUNDOS" -ForegroundColor Yellow
Write-Host "  Servidor local: $prefix" -ForegroundColor Green
Write-Host "  Pasta: $root"
Write-Host "  Para parar: Ctrl + C"
Write-Host ""

if (-not $NoBrowser) {
  Start-Process $prefix | Out-Null
}

while ($listener.IsListening) {
  $context = $null
  try {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response

    $urlPath = [System.Uri]::UnescapeDataString($request.Url.AbsolutePath)
    if ([string]::IsNullOrWhiteSpace($urlPath) -or $urlPath -eq "/") {
      $urlPath = "/index.html"
    }

    $relative = $urlPath.TrimStart("/").Replace("/", [System.IO.Path]::DirectorySeparatorChar)
    $fullPath = [System.IO.Path]::GetFullPath((Join-Path $root $relative))

    if (-not $fullPath.StartsWith($root, [System.StringComparison]::OrdinalIgnoreCase)) {
      $response.StatusCode = 403
      $body = [System.Text.Encoding]::UTF8.GetBytes("403 - Acesso negado")
      $response.OutputStream.Write($body, 0, $body.Length)
      $response.Close()
      continue
    }

    if (Test-Path $fullPath -PathType Container) {
      $fullPath = Join-Path $fullPath "index.html"
    }

    if (Test-Path $fullPath -PathType Leaf) {
      $ext = [System.IO.Path]::GetExtension($fullPath).ToLowerInvariant()
      $type = $mime[$ext]
      if (-not $type) { $type = "application/octet-stream" }

      $bytes = [System.IO.File]::ReadAllBytes($fullPath)
      $response.ContentType = $type
      $response.Headers.Add("Cache-Control", "no-store, no-cache, must-revalidate")
      $response.ContentLength64 = $bytes.Length
      $response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
      $response.StatusCode = 404
      $notFound = Join-Path $root "404.html"
      if (Test-Path $notFound) {
        $bytes = [System.IO.File]::ReadAllBytes($notFound)
        $response.ContentType = "text/html; charset=utf-8"
        $response.OutputStream.Write($bytes, 0, $bytes.Length)
      } else {
        $body = [System.Text.Encoding]::UTF8.GetBytes("404 - Pagina nao encontrada: $urlPath")
        $response.OutputStream.Write($body, 0, $body.Length)
      }
    }

    $response.Close()
  } catch {
    if ($context) {
      try { $context.Response.StatusCode = 500; $context.Response.Close() } catch {}
    }
  }
}
