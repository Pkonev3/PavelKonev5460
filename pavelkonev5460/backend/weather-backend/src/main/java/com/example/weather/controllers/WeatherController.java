package com.example.weather.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*") // Allow requests from any origin
@RestController
public class WeatherController {

    @GetMapping("/api/weather/{city}")
    public ResponseEntity<?> getWeather(@PathVariable String city) {
        try {
            String apiKey = "2f908d8e5b60d81924c17cfd62de9af2";
            String url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&units=metric";

            RestTemplate restTemplate = new RestTemplate();
            Map<String, Object> apiResponse = restTemplate.getForObject(url, Map.class);

            Map<String, Object> formattedResponse = new HashMap<>();
            formattedResponse.put("city", apiResponse.get("name"));
            formattedResponse.put("temperature", ((Map) apiResponse.get("main")).get("temp"));
            formattedResponse.put("description", ((Map)((List) apiResponse.get("weather")).get(0)).get("description"));
            formattedResponse.put("windSpeed", ((Map) apiResponse.get("wind")).get("speed"));

            return ResponseEntity.ok(formattedResponse);
        } catch (Exception e) {
            e.printStackTrace(); // Log the error for debugging
            return ResponseEntity.status(404).body("City not found or an error occurred.");
        }
    }
}
