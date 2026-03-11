# 🛒 eCommerce Full Pipeline — Complete DevOps Project

> A production-grade DevOps CI/CD pipeline built from scratch on a local Ubuntu machine using GitHub, Jenkins, Docker, Kubernetes, Helm, Prometheus, and Grafana.

![DevOps](https://img.shields.io/badge/DevOps-Full%20Pipeline-brightgreen)
![Docker](https://img.shields.io/badge/Docker-Containerized-blue)
![Kubernetes](https://img.shields.io/badge/Kubernetes-Minikube-326CE5)
![Jenkins](https://img.shields.io/badge/Jenkins-CI%2FCD-D24939)
![Helm](https://img.shields.io/badge/Helm-v3.20.0-0F1689)
![Prometheus](https://img.shields.io/badge/Prometheus-Monitoring-E6522C)
![Grafana](https://img.shields.io/badge/Grafana-Dashboards-F46800)

---

## 📌 Project Overview

This project demonstrates a complete end-to-end DevOps pipeline for a Node.js eCommerce application called **NOVA Store**. Starting from application code, the pipeline automates building, testing, containerizing, deploying, and monitoring the application using industry-standard DevOps tools.

### 🏗️ Architecture

```
Developer pushes code
        ↓
    GitHub Repo
        ↓ (webhook)
    Jenkins CI/CD
        ↓
  ┌─────────────────────────┐
  │  1. Checkout Code        │
  │  2. Install Dependencies │
  │  3. Run Tests (Jest)     │
  │  4. Build Docker Image   │
  │  5. Push to DockerHub    │
  │  6. Deploy via Helm      │
  └─────────────────────────┘
        ↓
  Kubernetes (Minikube)
  ┌─────────────────────────┐
  │  4 Pods Running          │
  │  Rolling Updates         │
  │  Self-Healing            │
  └─────────────────────────┘
        ↓
  Monitoring
  ┌─────────────────────────┐
  │  Prometheus (metrics)    │
  │  Grafana (dashboards)    │
  └─────────────────────────┘
```

---

## 🛠️ Tech Stack

| Tool | Purpose | Version |
|------|---------|---------|
| Node.js | Application runtime | v20.x |
| Express.js | Web framework | v4.x |
| Jest + Supertest | Automated testing | v29.x |
| Docker | Containerization | Latest |
| DockerHub | Image registry | — |
| GitHub | Source code management | — |
| Jenkins | CI/CD automation | v2.541.2 |
| Kubernetes | Container orchestration | v1.35.0 |
| Minikube | Local Kubernetes cluster | v1.38.0 |
| Helm | Kubernetes package manager | v3.20.0 |
| Prometheus | Metrics collection | Latest |
| Grafana | Metrics visualization | Latest |
| ngrok | Webhook tunnel (local dev) | v3.36.1 |

---

## 📁 Project Structure

```
ecommerce-full-pipeline/
├── src/
│   ├── app.js              # Express app with API endpoints
│   ├── server.js           # Server entry point
│   └── public/
│       └── index.html      # NOVA Store frontend UI
├── test/
│   └── app.test.js         # Jest automated tests
├── k8s/
│   ├── deployment.yaml     # Kubernetes deployment manifest
│   └── service.yaml        # Kubernetes service manifest
├── helm/
│   └── ecommerce-chart/
│       ├── Chart.yaml      # Helm chart metadata
│       ├── values.yaml     # Default configuration values
│       └── templates/
│           ├── deployment.yaml  # Helm deployment template
│           └── service.yaml     # Helm service template
├── Dockerfile              # Docker image definition
├── .dockerignore           # Docker build exclusions
├── .gitignore              # Git exclusions
├── Jenkinsfile             # Jenkins pipeline definition
└── README.md               # This file
```

---

## 🚀 Getting Started

### Prerequisites

- Ubuntu (WSL2 on Windows works fine)
- Docker Desktop
- Git
- Node.js v18+
- Minikube
- kubectl
- Helm v3

### Clone the Repository

```bash
git clone https://github.com/tushartatke7-art/ecommerce-full-pipeline.git
cd ecommerce-full-pipeline
```

---

## 📋 Step-by-Step Setup Guide

### Phase 1 — Run the Application Locally

```bash
# Install dependencies
npm install

# Run tests
npm test

# Start the server
npm start
```

Visit `http://localhost:3000` to see the NOVA Store.

Test the API endpoints:
```bash
curl http://localhost:3000/health
curl http://localhost:3000/products
```

---

### Phase 2 — Docker Setup

```bash
# Build the Docker image
docker build -t tushartatke7/ecommerce-app:latest .

# Run the container locally
docker run -d -p 3000:3000 --name ecommerce-test tushartatke7/ecommerce-app:latest

# Test it
curl http://localhost:3000/health

# Push to DockerHub
docker login
docker push tushartatke7/ecommerce-app:latest

# Cleanup
docker stop ecommerce-test
docker rm ecommerce-test
```

> The image is only **311MB** thanks to `node:18-alpine` base image and `--only=production` flag.

---

### Phase 3 — Jenkins CI/CD Setup

#### Start Jenkins

```bash
docker start jenkins
```

Visit `http://localhost:8080`

Login: `admin` / `Admin12345`

#### Required Jenkins Credentials

Go to **Manage Jenkins → Credentials → Global** and add:

| ID | Type | Description |
|----|------|-------------|
| `dockerhub-creds` | Username/Password | DockerHub credentials |
| `github-creds` | Username/Password | GitHub token |

#### Create Pipeline Job

1. Click **New Item → Pipeline**
2. Name: `ecommerce-full-pipeline`
3. Build Triggers: ✅ **GitHub hook trigger for GITScm polling**
4. Pipeline Definition: **Pipeline script from SCM**
5. SCM: **Git**
6. Repo URL: `https://github.com/tushartatke7-art/ecommerce-full-pipeline.git`
7. Branch: `*/main`
8. Script Path: `Jenkinsfile`

#### Install Docker CLI inside Jenkins

```bash
docker exec -u root jenkins bash -c "apt-get update && apt-get install -y docker.io"
```

---

### Phase 4 — GitHub Webhook Setup

```bash
# Expose Jenkins publicly
ngrok http 8080
```

Copy the public URL and:
1. Update **Jenkins → Manage Jenkins → System → Jenkins URL**
2. Add webhook in **GitHub → repo Settings → Webhooks → Add webhook**
   - Payload URL: `https://YOUR-NGROK-URL/github-webhook/`
   - Content type: `application/json`
   - Events: **Just the push event**

> ⚠️ ngrok URL changes on every restart (free plan). Update both places when restarting.

---

### Phase 5 — Kubernetes Deployment

```bash
# Start Minikube
minikube start --driver=docker --memory=2200mb --cpus=2

# Deploy
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml

# Watch pods start
kubectl get pods -w

# Test
curl http://$(minikube ip):30080/health
```

---

### Phase 6 — Helm Deployment

```bash
# Validate chart
helm lint helm/ecommerce-chart

# Deploy
helm install ecommerce helm/ecommerce-chart

# Verify
helm list
kubectl get pods
```

#### Useful Helm Commands

```bash
# Scale replicas
helm upgrade ecommerce helm/ecommerce-chart --set replicaCount=5

# Update image tag
helm upgrade ecommerce helm/ecommerce-chart --set image.tag=v2.0

# View history
helm history ecommerce

# Rollback
helm rollback ecommerce 1
```

---

### Phase 7 — Monitoring Setup

```bash
# Add repos
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo add grafana https://grafana.github.io/helm-charts
helm repo update

# Create namespace
kubectl create namespace monitoring

# Install Prometheus
helm install prometheus prometheus-community/prometheus \
  --namespace monitoring \
  --set server.service.type=NodePort \
  --set server.service.nodePort=30090

# Install Grafana
helm install grafana grafana/grafana \
  --namespace monitoring \
  --set service.type=NodePort \
  --set service.nodePort=30030 \
  --set adminPassword=Admin12345

# Verify
kubectl get pods -n monitoring
```

#### Connect Prometheus to Grafana

1. Grafana → **Connections → Data Sources → Add → Prometheus**
2. URL: `http://<PROMETHEUS-CLUSTER-IP>:80`
   - Find ClusterIP: `kubectl get svc -n monitoring | grep prometheus-server`
3. Click **Save & Test**

#### Import Kubernetes Dashboard

1. Grafana → **Dashboards → New → Import**
2. Download: `https://grafana.com/api/dashboards/315/revisions/3/download`
3. Upload JSON → Select Prometheus → Import

---

### Phase 8 — Access Everything (WSL Setup)

Open **3 separate terminals:**

```bash
# Terminal 1
kubectl port-forward -n monitoring svc/prometheus-server 9090:80

# Terminal 2
kubectl port-forward -n monitoring svc/grafana 3001:80

# Terminal 3
kubectl port-forward svc/ecommerce-service 8081:80
```

| Service | URL | Login |
|---------|-----|-------|
| NOVA Store | http://localhost:8081 | — |
| Jenkins | http://localhost:8080 | admin / Admin12345 |
| Prometheus | http://localhost:9090 | — |
| Grafana | http://localhost:3001 | admin / Admin12345 |

---

## 🔄 Daily Startup Checklist

```bash
# 1. Start Jenkins
docker start jenkins

# 2. Start Minikube
minikube start --driver=docker --memory=2200mb --cpus=2

# 3. Verify
kubectl get pods
kubectl get pods -n monitoring

# 4. Port forward (3 terminals)
kubectl port-forward -n monitoring svc/prometheus-server 9090:80
kubectl port-forward -n monitoring svc/grafana 3001:80
kubectl port-forward svc/ecommerce-service 8081:80

# 5. Start ngrok
ngrok http 8080
```

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check — used by Kubernetes probes |
| GET | `/products` | Returns all products |
| GET | `/products/:id` | Returns single product by ID |
| POST | `/cart` | Add item to cart |

---

## 🧪 Running Tests

```bash
npm test
```

```
PASS  test/app.test.js
  eCommerce API Tests
    ✓ GET /health - should return status UP
    ✓ GET /products - should return list of products
    ✓ GET /products/1 - should return single product
    ✓ GET /products/999 - should return 404
    ✓ POST /cart - should add item to cart

Tests: 5 passed, 5 total
```

---

## 📊 Jenkins Pipeline Stages

```
Stage 1: Checkout        → Pull latest code from GitHub
Stage 2: Dependencies    → npm install
Stage 3: Tests           → npm test (5 automated tests)
Stage 4: Docker Build    → docker build -t tushartatke7/ecommerce-app:BUILD_NUMBER
Stage 5: Docker Push     → Push versioned image to DockerHub
Stage 6: K8s Deploy      → helm upgrade --install (rolling update)
Stage 7: Cleanup         → Remove local Docker image
```

---

## 🏆 Key DevOps Concepts Demonstrated

| Concept | Implementation |
|---------|---------------|
| Infrastructure as Code | Kubernetes manifests + Helm charts |
| CI/CD Pipeline | Jenkins with 7 automated stages |
| Containerization | Docker with optimized multi-layer builds |
| Container Orchestration | Kubernetes with 4 replicas |
| Zero Downtime Deployment | Rolling updates (maxUnavailable: 0) |
| Self-Healing | Kubernetes auto-restarts failed pods |
| Package Management | Helm charts with versioned releases |
| Monitoring | Prometheus metrics + Grafana dashboards |
| Automated Testing | Jest tests gate every deployment |
| Webhook Automation | GitHub → Jenkins auto-trigger on push |
| Secret Management | Jenkins credentials store |

---

## 🔧 Troubleshooting

### Jenkins can't find Docker
```bash
docker exec -u root jenkins bash -c "apt-get update && apt-get install -y docker.io"
```

### Minikube out of memory
```bash
minikube delete
minikube start --driver=docker --memory=2200mb --cpus=2
```

### Pod in Error state
```bash
kubectl describe pod <pod-name>
kubectl logs <pod-name>
kubectl delete pod <pod-name>
```

### Grafana can't connect to Prometheus
```bash
kubectl get svc -n monitoring | grep prometheus-server
# Use the ClusterIP shown
```

### ngrok URL changed
1. Run `ngrok http 8080`
2. Update **Jenkins → Manage Jenkins → System → Jenkins URL**
3. Update **GitHub → Repo Settings → Webhooks → Edit**

---

## 📈 What's Next

- [ ] Deploy to AWS EKS
- [ ] Add SSL/TLS with cert-manager
- [ ] Implement Blue-Green deployments
- [ ] Setup ArgoCD for GitOps
- [ ] Add Terraform for infrastructure provisioning
- [ ] Configure Prometheus alerting rules
- [ ] Add Slack notifications in Jenkins

---

## 👨‍💻 Author

**Tushar Tatke**
- GitHub: [@tushartatke7-art](https://github.com/tushartatke7-art)
- DockerHub: [tushartatke7](https://hub.docker.com/u/tushartatke7)

---

> 🎯 Built as a complete DevOps learning project — from zero to full production-grade pipeline on local machine.
