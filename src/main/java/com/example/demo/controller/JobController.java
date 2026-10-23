
package com.example.demo.controller;

import com.example.demo.model.Job;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicLong;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final List<Job> jobs = new CopyOnWriteArrayList<>();
    private final AtomicLong idGenerator = new AtomicLong(1);

    // Get all job postings
    @GetMapping
    public List<Job> getAllJobs() {
        return jobs;
    }

    // Create a new job posting
    @PostMapping
    public Job createJob(@RequestBody Job job) {

        job.setId(idGenerator.getAndIncrement());
        jobs.add(job);

        return job;
    }
}

