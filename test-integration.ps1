# Integration Test Script for Travel Planner

Write-Host "🧪 Testing Travel Planner Integration..." -ForegroundColor Cyan
Write-Host ""

# Test 1: Backend Health Check
Write-Host "Test 1: Backend Health Check" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/health" -Method Get
    if ($response.success) {
        Write-Host "✅ Backend is healthy" -ForegroundColor Green
        Write-Host "   Redis: $($response.services.redis)" -ForegroundColor Gray
        Write-Host "   Firebase: $($response.services.firebase)" -ForegroundColor Gray
        Write-Host "   Gemini: $($response.services.gemini)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Backend is not running. Please start with 'npm run dev'" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Test 2: Parse Intent
Write-Host "Test 2: AI Intent Parsing" -ForegroundColor Yellow
$intentBody = @{
    text = "I want to visit Tokyo for 5 days, interested in sushi and temples"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/parse-intent" `
        -Method Post `
        -ContentType "application/json" `
        -Body $intentBody
    
    if ($response.success) {
        Write-Host "✅ Intent parsed successfully" -ForegroundColor Green
        Write-Host "   Destination: $($response.data.destination)" -ForegroundColor Gray
        Write-Host "   Duration: $($response.data.duration) days" -ForegroundColor Gray
        Write-Host "   Budget: $($response.data.budget)" -ForegroundColor Gray
        Write-Host "   Interests: $($response.data.interests -join ', ')" -ForegroundColor Gray
        Write-Host "   Cached: $($response.cached)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Intent parsing failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 3: Generate Itinerary (This will take longer)
Write-Host "Test 3: Generate Itinerary (This may take 10-15 seconds...)" -ForegroundColor Yellow
$itineraryBody = @{
    destination = "Paris, France"
    duration = 3
    budget = "moderate"
    interests = @("museums", "food", "architecture")
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/generate-itinerary" `
        -Method Post `
        -ContentType "application/json" `
        -Body $itineraryBody `
        -TimeoutSec 30
    
    if ($response.success) {
        Write-Host "✅ Itinerary generated successfully" -ForegroundColor Green
        Write-Host "   Title: $($response.data.title)" -ForegroundColor Gray
        Write-Host "   Days: $($response.data.days.Count)" -ForegroundColor Gray
        Write-Host "   Cached: $($response.cached)" -ForegroundColor Gray
        if ($response.saved) {
            Write-Host "   Saved ID: $($response.itineraryId)" -ForegroundColor Gray
        }
    }
} catch {
    Write-Host "❌ Itinerary generation failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 Integration tests complete!" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor White
Write-Host "1. Start the frontend: cd client && npm run dev" -ForegroundColor Gray
Write-Host "2. Open http://localhost:3000 in your browser" -ForegroundColor Gray
Write-Host "3. Try the AI-powered itinerary generation!" -ForegroundColor Gray
