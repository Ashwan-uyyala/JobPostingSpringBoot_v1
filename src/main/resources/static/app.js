
const API_URL = "/api/jobs";

function createJobCard(job) {
    const card = document.createElement("article");
    card.className = "job-card";

    const title = document.createElement("h2");
    title.textContent = job.title;

    const company = document.createElement("p");
    company.className = "company";
    company.textContent = job.company;

    const meta = document.createElement("div");
    meta.className = "job-meta";

    [job.location, job.jobType, job.salary].forEach(value => {
        const tag = document.createElement("span");
        tag.className = "tag";
        tag.textContent = value;
        meta.appendChild(tag);
    });

    const description = document.createElement("p");
    description.className = "job-description";
    description.textContent = job.description;

    const skills = document.createElement("p");
    skills.className = "skills";
    skills.textContent = "Skills: " + job.skills;

    card.append(title, company, meta, description, skills);
    return card;
}

// Handle the Create Job form
const jobForm = document.getElementById("jobForm");

if (jobForm) {
    jobForm.addEventListener("submit", async event => {
        event.preventDefault();

        const status = document.getElementById("statusMessage");
        const createdJob = document.getElementById("createdJob");
        const submitButton = jobForm.querySelector("button[type='submit']");

        status.textContent = "";
        status.className = "";
        createdJob.replaceChildren();
        submitButton.disabled = true;
        submitButton.textContent = "Creating...";

        const formData = new FormData(jobForm);
        const job = Object.fromEntries(formData.entries());

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(job)
            });

            if (!response.ok) {
                throw new Error("Could not create the job.");
            }

            const savedJob = await response.json();

            status.textContent =
                "Job created successfully! You can return home and check Job Postings.";
            status.className = "success-message";

            createdJob.appendChild(createJobCard(savedJob));
            createdJob.firstElementChild.classList.add("created-card");

            const homeLink = document.createElement("a");
            homeLink.href = "/";
            homeLink.className = "button secondary";
            homeLink.textContent = "Back to Home";
            createdJob.appendChild(homeLink);

            jobForm.reset();

        } catch (error) {
            status.textContent =
                "Unable to create the job. Please ensure the Spring Boot server is running and try again.";
            status.className = "error-message";
            console.error(error);

        } finally {
            submitButton.disabled = false;
            submitButton.textContent = "Create Job";
        }
    });
}

// Load all job postings
const jobsContainer = document.getElementById("jobsContainer");

if (jobsContainer) {
    async function loadJobs() {
        const message = document.getElementById("jobsMessage");
        message.textContent = "Loading jobs...";

        try {
            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error("Could not load jobs.");
            }

            const jobs = await response.json();
            jobsContainer.replaceChildren();

            if (jobs.length === 0) {
                message.textContent =
                    "No job postings yet. Be the first to create one!";
                return;
            }

            message.textContent = `${jobs.length} job posting(s) available.`;

            jobs.forEach(job => {
                jobsContainer.appendChild(createJobCard(job));
            });

        } catch (error) {
            message.textContent =
                "Unable to load jobs. Please check that the server is running.";
            console.error(error);
        }
    }

    loadJobs();
}
