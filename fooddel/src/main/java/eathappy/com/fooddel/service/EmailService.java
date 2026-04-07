package eathappy.com.fooddel.service;

import eathappy.com.fooddel.entity.Order;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    public EmailService(ObjectProvider<JavaMailSender> mailSenderProvider) {
        this.mailSender = mailSenderProvider.getIfAvailable();
    }

    public void sendOrderEmail(String to, Order order) {
        if (mailSender == null) {
            logger.info("Mail sender is not configured. Skipping order email for {}", to);
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("Order Confirmed");
            message.setText("Your order #" + order.getId() + " is placed successfully.");
            mailSender.send(message);
            logger.info("Order confirmation email sent to {}", to);
        } catch (MailException ex) {
            logger.warn("Order placed but email could not be sent: {}", ex.getMessage());
        }
    }
}
