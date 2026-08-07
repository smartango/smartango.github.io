// YAML Generator for GatearwayMan Docker Swarm Deployment
document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    const root = document.getElementById('yaml-generator-root');
    if (!root) return;
    
    function YAMLGenerator() {
        const [config, setConfig] = useState({
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
        });
        
        const [showYAML, setShowYAML] = useState(false);
        
        const handleChange = (e) => {
            const { name, value, type, checked } = e.target;
            setConfig(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        };
        
        const generateYAML = () => {
            setShowYAML(true);
        };
        
        const copyToClipboard = () => {
            const yamlContent = buildYAML();
            navigator.clipboard.writeText(yamlContent).then(() => {
                alert('YAML configuration copied to clipboard!');
            });
        };
        
        const buildYAML = () => {
            const envVars = [];
            
            // Basic environment variables
            envVars.push(`      - LOG_LEVEL=${config.logLevel}`);
            envVars.push(`      - SERVICE_PORT=${config.port}`);
            
            // Authentication
            if (config.authEnabled && config.jwtSecret) {
                envVars.push(`      - AUTH_ENABLED=true`);
                envVars.push(`      - JWT_SECRET=${config.jwtSecret}`);
            }
            
            // Backends
            if (config.backends) {
                envVars.push(`      - BACKENDS=${config.backends}`);
            }
            
            // Routing rules
            if (config.routingRules) {
                envVars.push(`      - ROUTING_RULES=${config.routingRules}`);
            }
            
            // Metrics
            if (config.enableMetrics) {
                envVars.push(`      - METRICS_ENABLED=true`);
                envVars.push(`      - METRICS_PORT=${config.metricsPort}`);
            }
            
            // Health check
            if (config.enableHealthCheck) {
                envVars.push(`      - HEALTH_CHECK_PATH=${config.healthCheckPath}`);
            }
            
            const yaml = `version: '3.8'

services:
  ${config.serviceName}:
    image: smartango/gatearwayman:${config.version}
    
    deploy:
      replicas: ${config.replicas}
      restart_policy:
        condition: on-failure
        delay: 5s
        max_attempts: 3
      resources:
        limits:
          cpus: '${config.cpuLimit}'
          memory: ${config.memoryLimit}
        reservations:
          cpus: '0.25'
          memory: 256M
      labels:
        - "com.smartango.service=gatearwayman"
      timeout: 10s
      retries: 3
      start_period: 40s` : ''}

networks:
  ${config.network}:
    driver: overlay
    attachable: true
`;
            
            return yaml;
        };
        
        return React.createElement('div', { className: 'yaml-generator' },
            React.createElement('h3', null, 'Docker Swarm Deployment Configuration'),
            React.createElement('p', null, 'Customize your GatearwayMan deployment configuration:'),
            
            // Basic Configuration
            React.createElement('div', { className: 'form-group' },
                React.createElement('label', null, 'Service Name'),
                React.createElement('input', {
                    type: 'text',
                    name: 'serviceName',
                    value: config.serviceName,
                    onChange: handleChange
                })
            ),
            
            React.createElement('div', { className: 'form-group' },
                React.createElement('label', null, 'Version'),
                React.createElement('input', {
                    type: 'text',
                    name: 'version',
                    value: config.version,
                    onChange: handleChange,
                    placeholder: 'e.g., latest, 1.0.0'
                })
            ),
            
            React.createElement('div', { className: 'form-group' },
                React.createElement('label', null, 'Number of Replicas'),
                React.createElement('input', {
                    type: 'number',
                    name: 'replicas',
                    value: config.replicas,
                    onChange: handleChange,
                    min: '1'
                })
            ),
            
            React.createElement('div', { className: 'form-group' },
                React.createElement('label', null, 'Container Port'),
                React.createElement('input', {
                    type: 'number',
                    name: 'port',
                    value: config.port,
                    onChange: handleChange
                })
            ),
            
            React.createElement('div', { className: 'form-group' },
                React.createElement('label', null, 'Host Port'),
                React.createElement('input', {
                    type: 'number',
                    name: 'hostPort',
                    value: config.hostPort,
                    onChange: handleChange
                })
            ),
            
            React.createElement('div', { className: 'form-group' },
                React.createElement('label', null, 'Network Name'),
                React.createElement('input', {
                    type: 'text',
                    name: 'network',
                    value: config.network,
                    onChange: handleChange
                })
            ),
            
            // Authentication
            React.createElement('div', { className: 'form-group' },
                React.createElement('label', null,
                    React.createElement('input', {
                        type: 'checkbox',
                        name: 'authEnabled',
                        checked: config.authEnabled,
                        onChange: handleChange,
                        style: { width: 'auto', marginRight: '0.5rem' }
                    }),
                    'Enable JWT Authentication'
                )
            ),
            
            config.authEnabled && React.createElement('div', { className: 'form-group' },
                React.createElement('label', null, 'JWT Secret'),
                React.createElement('input', {
                    type: 'password',
                    name: 'jwtSecret',
                    value: config.jwtSecret,
                    onChange: handleChange,
                    placeholder: 'Enter a secure secret'
                })
            ),
            
            // Backend Services
            React.createElement('div', { className: 'form-group' },
                React.createElement('label', null, 'Backend Services'),
                React.createElement('textarea', {
                    name: 'backends',
                    value: config.backends,
                    onChange: handleChange,
                    rows: '3',
                    placeholder: 'http://service1:8080,http://service2:8080'
                }),
                React.createElement('small', null, 'Comma-separated list of backend service URLs')
            ),
            
            // Routing Rules
            React.createElement('div', { className: 'form-group' },
                React.createElement('label', null, 'Routing Rules'),
                React.createElement('textarea', {
                    name: 'routingRules',
                    value: config.routingRules,
                    onChange: handleChange,
                    rows: '3',
                    placeholder: '/api/*->service1,/app/*->service2'
                }),
                React.createElement('small', null, 'Path patterns and their target services')
            ),
            
            // Metrics & Monitoring
            React.createElement('div', { className: 'form-group' },
                React.createElement('label', null,
                    React.createElement('input', {
                        type: 'checkbox',
                        name: 'enableMetrics',
                        checked: config.enableMetrics,
                        onChange: handleChange,
                        style: { width: 'auto', marginRight: '0.5rem' }
                    }),
                    'Enable Prometheus Metrics'
                )
            ),
            
            config.enableMetrics && React.createElement('div', { className: 'form-group' },
                React.createElement('label', null, 'Metrics Port'),
                React.createElement('input', {
                    type: 'number',
                    name: 'metricsPort',
                    value: config.metricsPort,
                    onChange: handleChange
                })
            ),
            
            // Health Check
            React.createElement('div', { className: 'form-group' },
                React.createElement('label', null,
                    React.createElement('input', {
                        type: 'checkbox',
                        name: 'enableHealthCheck',
                        checked: config.enableHealthCheck,
                        onChange: handleChange,
                        style: { width: 'auto', marginRight: '0.5rem' }
                    }),
                    'Enable Health Check'
                )
            ),
            
            config.enableHealthCheck && React.createElement('div', { className: 'form-group' },
                React.createElement('label', null, 'Health Check Path'),
                React.createElement('input', {
                    type: 'text',
                    name: 'healthCheckPath',
                    value: config.healthCheckPath,
                    onChange: handleChange
                })
            ),
            
            // Resource Limits
            React.createElement('div', { className: 'form-group' },
                React.createElement('label', null, 'CPU Limit'),
                React.createElement('input', {
                    type: 'text',
                    name: 'cpuLimit',
                    value: config.cpuLimit,
                    onChange: handleChange,
                    placeholder: 'e.g., 0.5, 1.0, 2.0'
                })
            ),
            
            React.createElement('div', { className: 'form-group' },
                React.createElement('label', null, 'Memory Limit'),
                React.createElement('input', {
                    type: 'text',
                    name: 'memoryLimit',
                    value: config.memoryLimit,
                    onChange: handleChange,
                    placeholder: 'e.g., 512M, 1G'
                })
            ),
            
            // Log Level
            React.createElement('div', { className: 'form-group' },
                React.createElement('label', null, 'Log Level'),
                React.createElement('select', {
                    name: 'logLevel',
                    value: config.logLevel,
                    onChange: handleChange
                },
                    React.createElement('option', { value: 'debug' }, 'Debug'),
                    React.createElement('option', { value: 'info' }, 'Info'),
                    React.createElement('option', { value: 'warn' }, 'Warning'),
                    React.createElement('option', { value: 'error' }, 'Error')
                )
            ),
            
            // Buttons
            React.createElement('div', null,
                React.createElement('button', {
                    className: 'btn btn-primary',
                    onClick: generateYAML
                }, 'Generate YAML'),
                showYAML && React.createElement('button', {
                    className: 'btn btn-secondary',
                    onClick: copyToClipboard
                }, 'Copy to Clipboard')
            ),
            
            // YAML Output
            showYAML && React.createElement('div', { className: 'yaml-output' },
                React.createElement('h4', null, 'Generated Docker Compose YAML:'),
                React.createElement('pre', null, buildYAML())
            )
        );
    }
    
    // Initialize the React app
    const root = document.getElementById('yaml-generator-root');
    if (root) {
        createRoot(root).render(React.createElement(YAMLGenerator));
    }
})();
