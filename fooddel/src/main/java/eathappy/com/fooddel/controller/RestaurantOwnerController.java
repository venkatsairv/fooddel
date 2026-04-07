package eathappy.com.fooddel.controller;

import eathappy.com.fooddel.entity.MenuItem;
import eathappy.com.fooddel.service.RestaurantOwnerService;
import java.security.Principal;
import java.util.List;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/owner")
public class RestaurantOwnerController {

    private final RestaurantOwnerService restaurantOwnerService;

    public RestaurantOwnerController(RestaurantOwnerService restaurantOwnerService) {
        this.restaurantOwnerService = restaurantOwnerService;
    }

    @PostMapping("/register")
    public String register(@RequestBody RestaurantOwnerService.OwnerRegisterRequest request) {
        return restaurantOwnerService.register(request);
    }

    @PostMapping("/login")
    public String login(@RequestBody RestaurantOwnerService.OwnerLoginRequest request) {
        return restaurantOwnerService.login(request);
    }

    @GetMapping("/menu")
    public List<MenuItem> getOwnerMenu(Principal principal) {
        return restaurantOwnerService.getOwnerMenu(principal.getName());
    }

    @PostMapping("/menu")
    public MenuItem addMenuItem(@RequestBody RestaurantOwnerService.OwnerMenuRequest request, Principal principal) {
        return restaurantOwnerService.addMenuItem(principal.getName(), request);
    }

    @PutMapping("/menu/{id}")
    public MenuItem updateMenuItem(
            @PathVariable Long id,
            @RequestBody RestaurantOwnerService.OwnerMenuRequest request,
            Principal principal
    ) {
        return restaurantOwnerService.updateMenuItem(principal.getName(), id, request);
    }

    @PatchMapping("/menu/{id}/availability")
    public MenuItem updateAvailability(
            @PathVariable Long id,
            @RequestParam Boolean available,
            Principal principal
    ) {
        return restaurantOwnerService.updateAvailability(principal.getName(), id, available);
    }

    @DeleteMapping("/menu/{id}")
    public String deleteMenuItem(@PathVariable Long id, Principal principal) {
        return restaurantOwnerService.deleteMenuItem(principal.getName(), id);
    }
}
