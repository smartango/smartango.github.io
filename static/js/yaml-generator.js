// GatearwayMan Docker Swarm YAML Configuration Generator
document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    const root = document.getElementById('yaml-generator-root');
    if (!root) return;
    
    // Configuration state
    const config = {
        networkName: 'gateway_network',
        networkExternal: true,
        traefikVersion: 'v2',
        
        // GatearwayMan GUI
        guiImage: 'smartango/gatearwayman-gui:latest',
        guiReplicas: 1,
        guiHost: 'gateway.example.com',
        guiPort: 80,
        
        // GatearwayMan Backend
        backendEnabled: false,
        backendImage: 'smartango/gatearwayman:latest',
        backendReplicas: 1,
        backendHost: 'api.example.com',
        backendPort: 8080,
        backendCpuLimit: '0.5',
        backendMemoryLimit: '512M'
    };
    
    // Generate Traefik labels
    function generateTraefikLabels(serviceName, host, port, version) {
        const labels = {};
        
        if (version === 'v1') {
            // Traefik v1.7.x labels
            labels['traefik.enable'] = 'true';
            labels['traefik.frontend.rule'] = `Host:${host}`;
            labels['traefik.port'] = port.toString();
            labels['traefik.docker.network'] = config.networkName;
        } else {
            // Traefik v2.x labels
            const routerName = serviceName.replace(/[^a-zA-Z0-9]/g, '-');
            labels['traefik.enable'] = 'true';
            labels[`traefik.http.routers.${routerName}.rule`] = `Host(\`${host}\`)`;
            labels[`traefik.http.routers.${routerName}.entrypoints`] = 'web';
            labels[`traefik.http.services.${routerName}.loadbalancer.server.port`] = port.toString();
            labels['traefik.docker.network'] = config.networkName;
        }
        
        return Object.entries(labels).map(([k, v]) => `${k}=${v}`);
    }
    
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
                // Handle strings, numbers, booleans
                let formattedValue = value;
                if (typeof value === 'string') {
                    const needsQuotes = value.includes(':') || value.match(/^\d+$/) || value.includes('#');
                    formattedValue = needsQuotes ? `'${value}'` : value;
                }
                yaml += `${spaces}${key}: ${formattedValue}\n`;
            }
        }
        
        return yaml;
    }
    
    // Build Docker Compose JSON structure
    function buildComposeObject() {
        const services = {};
        
        // GatearwayMan GUI Service (always included)
        const guiLabels = generateTraefikLabels('gatearwayman-gui', config.guiHost, config.guiPort, config.traefikVersion);
        
        services['gatearwayman-gui'] = {
            image: config.guiImage,
            deploy: {
                replicas: config.guiReplicas,
                restart_policy: {
                    condition: 'on-failure'
                },
                labels: guiLabels
            },
            networks: [config.networkName]
        };
        
        // GatearwayMan Backend Service (optional)
        if (config.backendEnabled) {
            const backendLabels = generateTraefikLabels('gatearwayman-backend', config.backendHost, config.backendPort, config.traefikVersion);
            
            services['gatearwayman-backend'] = {
                image: config.backendImage,
                deploy: {
                    replicas: config.backendReplicas,
                    restart_policy: {
                        condition: 'on-failure'
                    },
                    resources: {
                        limits: {
                            cpus: config.backendCpuLimit,
                            memory: config.backendMemoryLimit
                        }
                    },
                    labels: backendLabels
                },
                networks: [config.networkName]
            };
        }
        
        // Network configuration
        const networks = {};
        networks[config.networkName] = config.networkExternal 
            ? { external: true }
            : { driver: 'overlay' };
        
        return {
            version: '3.8',
            services: services,
            networks: networks
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
                <p>Generate your GatearwayMan stack configuration with Traefik integration:</p>
                
                <form id="yaml-form">
                    <div class="form-section">
                        <h4>Network Configuration</h4>
                        
                        <div class="form-group">
                            <label for="networkName">Network Name</label>
                            <input type="text" id="networkName" name="networkName" value="${config.networkName}">
                        </div>
                        
                        <div class="form-group">
                            <label>
                                <input type="checkbox" id="networkExternal" name="networkExternal" ${config.networkExternal ? 'checked' : ''}>
                                External Network (already exists)
                            </label>
                        </div>
                    </div>
                    
                    <div class="form-section">
                        <h4>Traefik Configuration</h4>
                        
                        <div class="form-group">
                            <label for="traefikVersion">Traefik Version</label>
                            <select id="traefikVersion" name="traefikVersion">
                                <option value="v1" ${config.traefikVersion === 'v1' ? 'selected' : ''}>Traefik v1.7.x</option>
                                <option value="v2" ${config.traefikVersion === 'v2' ? 'selected' : ''}>Traefik v2.x</option>
                            </select>
                            <small>Choose the version of Traefik for label generation</small>
                        </div>
                    </div>
                    
                    <div class="form-section">
                        <h4>GatearwayMan GUI</h4>
                        
                        <div class="form-group">
                            <label for="guiImage">Docker Image</label>
                            <input type="text" id="guiImage" name="guiImage" value="${config.guiImage}">
                        </div>
                        
                        <div class="form-group">
                            <label for="guiReplicas">Replicas</label>
                            <input type="number" id="guiReplicas" name="guiReplicas" value="${config.guiReplicas}" min="1">
                        </div>
                        
                        <div class="form-group">
                            <label for="guiHost">Host (Domain)</label>
                            <input type="text" id="guiHost" name="guiHost" value="${config.guiHost}" placeholder="gateway.example.com">
                            <small>Domain name for Traefik routing</small>
                        </div>
                        
                        <div class="form-group">
                            <label for="guiPort">Container Port</label>
                            <input type="number" id="guiPort" name="guiPort" value="${config.guiPort}">
                        </div>
                    </div>
                    
                    <div class="form-section">
                        <h4>GatearwayMan Backend (Optional)</h4>
                        
                        <div class="form-group">
                            <label>
                                <input type="checkbox" id="backendEnabled" name="backendEnabled" ${config.backendEnabled ? 'checked' : ''}>
                                Enable Backend Service
                            </label>
                        </div>
                        
                        <div id="backendConfig" style="display: ${config.backendEnabled ? 'block' : 'none'}">
                            <div class="form-group">
                                <label for="backendImage">Docker Image</label>
                                <input type="text" id="backendImage" name="backendImage" value="${config.backendImage}">
                            </div>
                            
                            <div class="form-group">
                                <label for="backendReplicas">Replicas</label>
                                <input type="number" id="backendReplicas" name="backendReplicas" value="${config.backendReplicas}" min="1">
                            </div>
                            
                            <div class="form-group">
                                <label for="backendHost">Host (Domain)</label>
                                <input type="text" id="backendHost" name="backendHost" value="${config.backendHost}" placeholder="api.example.com">
                            </div>
                            
                            <div class="form-group">
                                <label for="backendPort">Container Port</label>
                                <input type="number" id="backendPort" name="backendPort" value="${config.backendPort}">
                            </div>
                            
                            <div class="form-group">
                                <label for="backendCpuLimit">CPU Limit</label>
                                <input type="text" id="backendCpuLimit" name="backendCpuLimit" value="${config.backendCpuLimit}" placeholder="e.g., 0.5, 1.0">
                            </div>
                            
                            <div class="form-group">
                                <label for="backendMemoryLimit">Memory Limit</label>
                                <input type="text" id="backendMemoryLimit" name="backendMemoryLimit" value="${config.backendMemoryLimit}" placeholder="e.g., 512M, 1G">
                            </div>
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
                if (name === 'backendEnabled') {
                    document.getElementById('backendConfig').style.display = target.checked ? 'block' : 'none';
                }
            } else if (target.type === 'number') {
                config[name] = parseInt(target.value, 10);
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
