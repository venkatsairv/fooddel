package eathappy.com.fooddel.controller;

import eathappy.com.fooddel.entity.MenuItem;
import eathappy.com.fooddel.entity.Restaurant;
import eathappy.com.fooddel.service.RestaurantService;
import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RestaurantController {

    private final RestaurantService restaurantService;

    public RestaurantController(RestaurantService restaurantService) {
        this.restaurantService = restaurantService;
    }

    @GetMapping("/")
    public Map<String, Object> home() {
        return restaurantService.getHomePageData();
    }

    @GetMapping("/locations")
    public List<String> getLocations() {
        return restaurantService.getAllLocations();
    }

    @GetMapping("/restaurants")
    public List<Restaurant> getRestaurants(@RequestParam(required = false) String location) {
        return restaurantService.getRestaurantsByLocation(location);
    }

    @GetMapping("/menu/{restaurantId}")
    public List<MenuItem> getMenu(@PathVariable Long restaurantId) {
        return restaurantService.getMenuByRestaurant(restaurantId);
    }
}
