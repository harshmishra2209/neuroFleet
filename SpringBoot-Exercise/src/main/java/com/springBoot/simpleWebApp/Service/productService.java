package com.springBoot.simpleWebApp.Service;

import com.springBoot.simpleWebApp.Model.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.springBoot.simpleWebApp.repository.ProductRepo;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class productService
{
    @Autowired
    ProductRepo repo;

//    List<Product> products = new ArrayList<>(Arrays.asList(new Product(101, "iPhone", 50000), new Product(102, "Chocolate", 100)));

    public List<Product> getProducts()
    {
        return repo.findAll();
    }

    public Product getProductById(int prodId)
    {

        return repo.findById(prodId).orElse(new Product());
    }

    public void addProduct(Product prod)
    {
        repo.save(prod);
    }

    public void updateProduct(Product prod)
    {
        repo.save(prod);
    }

    public void deleteProduct(int prodId)
    {
        repo.deleteById(prodId);
    }
}
