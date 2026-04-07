package eathappy.com.fooddel.controller;

import eathappy.com.fooddel.entity.Order;
import eathappy.com.fooddel.service.OrderService;
import java.security.Principal;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/order/place")
    public Order placeOrder(Principal principal) {
        return orderService.placeOrder(principal.getName());
    }

    @PostMapping("/order/cancel/{id}")
    public Order cancelOrder(@PathVariable Long id, Principal principal) {
        return orderService.cancelOrder(principal.getName(), id);
    }

    @GetMapping("/orders")
    public List<Order> getOrders(Principal principal) {
        return orderService.getOrders(principal.getName());
    }
}
