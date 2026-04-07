package eathappy.com.fooddel.service;

import eathappy.com.fooddel.entity.MenuItem;
import eathappy.com.fooddel.entity.Restaurant;
import eathappy.com.fooddel.entity.RestaurantOwner;
import eathappy.com.fooddel.repository.MenuRepository;
import eathappy.com.fooddel.repository.RestaurantOwnerRepository;
import eathappy.com.fooddel.repository.RestaurantRepository;
import java.math.BigDecimal;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RestaurantOwnerService {

    private static final Logger logger = LoggerFactory.getLogger(RestaurantOwnerService.class);

    private final RestaurantOwnerRepository restaurantOwnerRepository;
    private final RestaurantRepository restaurantRepository;
    private final MenuRepository menuRepository;
    private final PasswordEncoder passwordEncoder;

    public RestaurantOwnerService(
            RestaurantOwnerRepository restaurantOwnerRepository,
            RestaurantRepository restaurantRepository,
            MenuRepository menuRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.restaurantOwnerRepository = restaurantOwnerRepository;
        this.restaurantRepository = restaurantRepository;
        this.menuRepository = menuRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public String register(OwnerRegisterRequest request) {
        if (request.name() == null || request.name().isBlank()) {
            throw new IllegalArgumentException("Owner name is required");
        }
        if (request.email() == null || request.email().isBlank()) {
            throw new IllegalArgumentException("Owner email is required");
        }
        if (request.password() == null || request.password().isBlank()) {
            throw new IllegalArgumentException("Owner password is required");
        }
        if (request.restaurantId() == null) {
            throw new IllegalArgumentException("Restaurant id is required");
        }

        String email = request.email().trim().toLowerCase();
        if (restaurantOwnerRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Owner email already registered");
        }
        if (restaurantOwnerRepository.existsByRestaurantId(request.restaurantId())) {
            throw new IllegalArgumentException("This restaurant already has an owner account");
        }

        Restaurant restaurant = restaurantRepository.findById(request.restaurantId())
                .orElseThrow(() -> new IllegalArgumentException("Restaurant not found"));

        RestaurantOwner owner = new RestaurantOwner();
        owner.setName(request.name().trim());
        owner.setEmail(email);
        owner.setPassword(passwordEncoder.encode(request.password()));
        owner.setRestaurant(restaurant);
        restaurantOwnerRepository.save(owner);

        logger.info("Restaurant owner registered: {} for restaurant {}", email, restaurant.getId());
        return "Restaurant owner registered successfully";
    }

    public String login(OwnerLoginRequest request) {
        if (request.email() == null || request.password() == null) {
            throw new BadCredentialsException("Email and password are required");
        }

        RestaurantOwner owner = restaurantOwnerRepository.findByEmail(request.email().trim().toLowerCase())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(request.password(), owner.getPassword())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        logger.info("Restaurant owner login successful: {}", owner.getEmail());
        return "Owner login successful. Use the same email and password with Basic Auth for owner APIs.";
    }

    @Transactional(readOnly = true)
    public List<MenuItem> getOwnerMenu(String ownerEmail) {
        RestaurantOwner owner = getOwnerByEmail(ownerEmail);
        return menuRepository.findByRestaurantIdOrderByNameAsc(owner.getRestaurant().getId());
    }

    @Transactional
    public MenuItem addMenuItem(String ownerEmail, OwnerMenuRequest request) {
        RestaurantOwner owner = getOwnerByEmail(ownerEmail);
        validateMenuRequest(request);

        MenuItem menuItem = new MenuItem();
        menuItem.setName(request.name().trim());
        menuItem.setPrice(request.price());
        menuItem.setAvailable(request.available() == null ? Boolean.TRUE : request.available());
        menuItem.setRestaurant(owner.getRestaurant());
        return menuRepository.save(menuItem);
    }

    @Transactional
    public MenuItem updateMenuItem(String ownerEmail, Long menuItemId, OwnerMenuRequest request) {
        RestaurantOwner owner = getOwnerByEmail(ownerEmail);
        validateMenuRequest(request);

        MenuItem menuItem = getOwnedMenuItem(owner.getRestaurant().getId(), menuItemId);
        menuItem.setName(request.name().trim());
        menuItem.setPrice(request.price());
        menuItem.setAvailable(request.available() == null ? menuItem.getAvailable() : request.available());
        return menuRepository.save(menuItem);
    }

    @Transactional
    public MenuItem updateAvailability(String ownerEmail, Long menuItemId, Boolean available) {
        if (available == null) {
            throw new IllegalArgumentException("Availability value is required");
        }

        RestaurantOwner owner = getOwnerByEmail(ownerEmail);
        MenuItem menuItem = getOwnedMenuItem(owner.getRestaurant().getId(), menuItemId);
        menuItem.setAvailable(available);
        return menuRepository.save(menuItem);
    }

    @Transactional
    public String deleteMenuItem(String ownerEmail, Long menuItemId) {
        RestaurantOwner owner = getOwnerByEmail(ownerEmail);
        MenuItem menuItem = getOwnedMenuItem(owner.getRestaurant().getId(), menuItemId);
        menuRepository.delete(menuItem);
        return "Menu item deleted successfully";
    }

    private RestaurantOwner getOwnerByEmail(String ownerEmail) {
        return restaurantOwnerRepository.findByEmail(ownerEmail.trim().toLowerCase())
                .orElseThrow(() -> new IllegalArgumentException("Restaurant owner not found"));
    }

    private MenuItem getOwnedMenuItem(Long restaurantId, Long menuItemId) {
        MenuItem menuItem = menuRepository.findById(menuItemId)
                .orElseThrow(() -> new IllegalArgumentException("Menu item not found"));

        if (!menuItem.getRestaurant().getId().equals(restaurantId)) {
            throw new IllegalArgumentException("You can manage only your own restaurant menu items");
        }

        return menuItem;
    }

    private void validateMenuRequest(OwnerMenuRequest request) {
        if (request.name() == null || request.name().isBlank()) {
            throw new IllegalArgumentException("Menu item name is required");
        }
        if (request.price() == null || request.price().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Price must be greater than 0");
        }
    }

    public record OwnerRegisterRequest(String name, String email, String password, Long restaurantId) {
    }

    public record OwnerLoginRequest(String email, String password) {
    }

    public record OwnerMenuRequest(String name, BigDecimal price, Boolean available) {
    }
}
