// GatearwayMan Docker Swarm YAML Configuration Generator
document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    const root = document.getElementById('yaml-generator-root');
    if (!root) return;
    
    // Configuration state
    const config = {
        serviceName: 'gatearwayman',
        version: 'latest',
        replicas: 1,
        port: 8080,
        hostPort: 80,
        network: 'gateway_network',
        authEnabled: false,
        jwtSecret: '',
        backends: '',
        routingRules: '',
        enableMetrics: true,
        metricsPort: 9090,
        enableHealthCheck: true,
        healthCheckPath: '/health',
        cpuLimit: '0.5',
        memoryLimit: '512M',
        logLevel: 'info'
    };
    
    // Convert JS object to YAML
    function toYAML(obj, indent = 0) {
        const spaces = '  '.repeat(indent);
        let yaml = '';
        
        for (const key in obj) {
            const value = obj[key];
            
            if (value === null || value === undefined) {
                continue;
            }
            
            if (Array.isArray(value)) {
                yaml += `${spaces}${key}:\n`;
                value.forEach(item => {
                    if (typeof item === 'object' && item !== null) {
                        yaml += `${spaces}- `;
                        const itemYaml = toYAML(item, indent + 1);
                        yaml += itemYaml.substring((indent + 1) * 2 + 2);
                    } else {
                        yaml += `${spaces}- ${item}\n`;
                    }
                });
            } else if (typeof value === 'object' && value !== null) {
                yaml += `${spaces}${key}:\n`;
                yaml += toYAML(value, indent + 1);
            } else {
                const needsQuotes = typeof value === 'string' && (value.includes(':') || value.match(/^\d+$/));
                const formattedValue = needsQuotes ? `'${value}'` : value;
                yaml += `${spaces}${key}: ${formattedValue}\n`;
            }
        }
        
        return yaml;
    }
    
    // Build Docker Compose JSON structure
    function buildComposeObject() {
        const environment = [
            `LOG_LEVEL=${config.logLevel}`,
            `SERVICE_PORT=${config.port}`
        ];
        
        if (config.authEnabled && config.jwtSecret) {
            environment.push('AUTH_ENABLED=true');
            environment.push(`JWT_SECRET=${config.jwtSecret}`);
        }
        
        if (config.backends) {
            environment.push(`BACKENDS=${config.backends}`);
        }
        
        if (config.routingRules) {
            environment.push(`ROUTING_RULES=${config.routingRules}`);
        }
        
        if (config.enableMetrics) {
            environment.push('METRICS_ENABLED=true');
            environment.push(`METRICS_PORT=${config.metricsPort}`);
        }
        
        if (config.enableHealthCheck) {
            environment.push(`HEALTH_CHECK_PATH=${config.healthCheckPath}`);
        }
        
        const service = {
            image: `smartango/gatearwayman:${config.version}`,
            deploy: {
                replicas: config.replicas,
                restart_policy: {
                    condition: 'on-failure',
                    delay: '5s',
                    max_attempts: 3
                },
                resources: {
                    limits: {
                        cpus: config.cpuLimit,
                        memory: config.memoryLimit
                    },
                    reservations: {
                        cpus: '0.25',
                        memory: '256M'
                    }
                },
                labels: ['com.smartango.service=gatearwayman']
            },
            ports: [`${config.hostPort}:${config.port}`],
            networks: [config.network],
            environment: environment
        };
        
        if (config.enableHealthCheck) {
            service.healthcheck = {
                test: ['CMD', 'curl', '-f', `http://localhost:${config.port}${config.healthCheckPath}`],
                interval: '30s',
                timeout: '10s',
                retries: 3,
                start_period: '40s'
            };
        }
        
        return {
            version: '3.8',
            services: {
                [config.serviceName]: service
            },
            networks: {
                [config.network]: {
                    driver: 'overlay',
                    attachable: true
                }
            }
        };
    }
    
    // Build YAML from config
    function buildYAML() {
        const composeObj = buildComposeObject();
        return toYAML(composeObj);
    }
    
    // Render the form
    function render() {
        root.innerHTML = `
            <div class="yaml-generator">
                <h3>Docker Swarm Deployment Configuration</h3>
                <p>Customize your GatearwayMan deployment configuration:</p>
                
                <form id="yaml-form">
                    <div class="form-section">
                        <h4>Basic Configuration</h4>
                        
                        <div class="form-group">
                            <label for="serviceName">Service Name</label>
                            <input type="text" id="serviceName" name="serviceName" value="${config.serviceName}">
                        </div>
                        
                        <div class="form-group">
                            <label for="version">Version</label>
                            <input type="text" id="version" name="version" value="${config.version}" placeholder="e.g., latest, 1.0.0">
                        </div>
                        
                        <div class="form-group">
                            <label for="replicas">Number of Replicas</label>
                            <input type="number" id="replicas" name="replicas" value="${config.replicas}" min="1">
                        </div>
                        
                        <div class="form-group">
                            <label for="port">Container Port</label>
                            <input type="number" id="port" name="port" value="${config.port}">
                        </div>
                        
                        <div class="form-group">
                            <label for="hostPort">Host Port</label>
                            <input type="number" id="hostPort" name="hostPort" value="${config.hostPort}">
                        </div>
                        
                        <div class="form-group">
                            <label for="network">Network Name</label>
                            <input type="text" id="network" name="network" value="${config.network}">
                        </div>
                    </div>
                    
                    <div class="form-section">
                        <h4>Authentication</h4>
                        
                        <div class="form-group">
                            <label>
                                <input type="checkbox" id="authEnabled" name="authEnabled" ${config.authEnabled ? 'checked' : ''}>
                                Enable JWT Authentication
                            </label>
                        </div>
                        
                        <div class="form-group" id="jwtSecretGroup" style="display: ${config.authEnabled ? 'block' : 'none'}">
                            <label for="jwtSecret">JWT Secret</label>
                            <input type="password" id="jwtSecret" name="jwtSecret" value="${config.jwtSecret}" placeholder="Enter a secure secret">
                        </div>
                    </div>
                    
                    <div class="form-section">
                        <h4>Backend Services & Routing</h4>
                        
                        <div class="form-group">
                            <label for="backends">Backend Services</label>
                            <textarea id="backends" name="backends" rows="3" placeholder="http://service1:8080,http://service2:8080">${config.backends}</textarea>
                            <small>Comma-separated list of backend service URLs</small>
                        </div>
                        
                        <div class="form-group">
                            <label for="routingRules">Routing Rules</label>
                            <textarea id="routingRules" name="routingRules" rows="3" placeholder="/api/*->service1,/app/*->service2">${config.routingRules}</textarea>
                            <small>Path patterns and their target services</small>
                        </div>
                    </div>
                    
                    <div class="form-section">
                        <h4>Metrics & Monitoring</h4>
                        
                        <div class="form-group">
                            <label>
                                <input type="checkbox" id="enableMetrics" name="enableMetrics" ${config.enableMetrics ? 'checked' : ''}>
                                Enable Prometheus Metrics
                            </label>
                        </div>
                        
                        <div class="form-group" id="metricsPortGroup" style="display: ${config.enableMetrics ? 'block' : 'none'}">
                            <label for="metricsPort">Metrics Port</label>
                            <input type="number" id="metricsPort" name="metricsPort" value="${config.metricsPort}">
                        </div>
                    </div>
                    
                    <div class="form-section">
                        <h4>Health Check</h4>
                        
                        <div class="form-group">
                            <label>
                                <input type="checkbox" id="enableHealthCheck" name="enableHealthCheck" ${config.enableHealthCheck ? 'checked' : ''}>
                                Enable Health Check
                            </label>
                        </div>
                        
                        <div class="form-group" id="healthCheckPathGroup" style="display: ${config.enableHealthCheck ? 'block' : 'none'}">
                            <label for="healthCheckPath">Health Check Path</label>
                            <input type="text" id="healthCheckPath" name="healthCheckPath" value="${config.healthCheckPath}">
                        </div>
                    </div>
                    
                    <div class="form-section">
                        <h4>Resource Limits</h4>
                        
                        <div class="form-group">
                            <label for="cpuLimit">CPU Limit</label>
                            <input type="text" id="cpuLimit" name="cpuLimit" value="${config.cpuLimit}" placeholder="e.g., 0.5, 1.0, 2.0">
                        </div>
                        
                        <div class="form-group">
                            <label for="memoryLimit">Memory Limit</label>
                            <input type="text" id="memoryLimit" name="memoryLimit" value="${config.memoryLimit}" placeholder="e.g., 512M, 1G">
                        </div>
                        
                        <div class="form-group">
                            <label for="logLevel">Log Level</label>
                            <select id="logLevel" name="logLevel">
                                <option value="debug" ${config.logLevel === 'debug' ? 'selected' : ''}>Debug</option>
                                <option value="info" ${config.logLevel === 'info' ? 'selected' : ''}>Info</option>
                                <option value="warn" ${config.logLevel === 'warn' ? 'selected' : ''}>Warning</option>
                                <option value="error" ${config.logLevel === 'error' ? 'selected' : ''}>Error</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" id="generateBtn" class="btn btn-primary">Generate YAML</button>
                        <button type="button" id="copyBtn" class="btn btn-secondary" style="display: none;">Copy to Clipboard</button>
                    </div>
                </form>
                
                <div id="yaml-output" style="display: none;">
                    <h4>Generated Docker Compose YAML:</h4>
                    <pre id="yaml-content"></pre>
                </div>
            </div>
        `;
        
        attachEventListeners();
    }
    
    // Attach event listeners
    function attachEventListeners() {
        const form = document.getElementById('yaml-form');
        if (!form) return;
        
        // Update config on input change
        form.addEventListener('input', function(e) {
            const target = e.target;
            const name = target.name;
            
            if (target.type === 'checkbox') {
                config[name] = target.checked;
                
                // Show/hide conditional fields
                if (name === 'authEnabled') {
                    document.getElementById('jwtSecretGroup').style.display = target.checked ? 'block' : 'none';
                } else if (name === 'enableMetrics') {
                    document.getElementById('metricsPortGroup').style.display = target.checked ? 'block' : 'none';
                } else if (name === 'enableHealthCheck') {
                    document.getElementById('healthCheckPathGroup').style.display = target.checked ? 'block' : 'none';
                }
            } else {
                config[name] = target.value;
            }
        });
        
        // Generate YAML button
        document.getElementById('generateBtn').addEventListener('click', function() {
            const yamlContent = buildYAML();
            document.getElementById('yaml-content').textContent = yamlContent;
            document.getElementById('yaml-output').style.display = 'block';
            document.getElementById('copyBtn').style.display = 'inline-block';
        });
        
        // Copy to clipboard button
        document.getElementById('copyBtn').addEventListener('click', function() {
            const yamlContent = buildYAML();
            navigator.clipboard.writeText(yamlContent).then(function() {
                const btn = document.getElementById('copyBtn');
                const originalText = btn.textContent;
                btn.textContent = 'Copied!';
                setTimeout(function() {
                    btn.textContent = originalText;
                }, 2000);
            }).catch(function(err) {
                alert('Failed to copy to clipboard: ' + err);
            });
        });
    }
    
    // Initialize
    render();
});
