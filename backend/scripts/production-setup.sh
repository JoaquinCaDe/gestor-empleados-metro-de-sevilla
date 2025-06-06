#!/bin/bash
# Production deployment and configuration script

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 Metro de Sevilla Backend - Production Setup${NC}"
echo "================================================"

# Check Node.js version
check_node() {
    echo -e "${BLUE}🔍 Checking Node.js version...${NC}"
    if command -v node > /dev/null 2>&1; then
        NODE_VERSION=$(node --version)
        echo -e "${GREEN}✅ Node.js found: $NODE_VERSION${NC}"
        
        # Check if version is >= 18
        MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
        if [ $MAJOR_VERSION -ge 18 ]; then
            echo -e "${GREEN}✅ Node.js version is compatible${NC}"
        else
            echo -e "${RED}❌ Node.js version must be >= 18${NC}"
            exit 1
        fi
    else
        echo -e "${RED}❌ Node.js not found. Please install Node.js >= 18${NC}"
        exit 1
    fi
}

# Install dependencies
install_deps() {
    echo -e "${BLUE}📦 Installing production dependencies...${NC}"
    npm ci --only=production
    echo -e "${GREEN}✅ Dependencies installed${NC}"
}

# Validate environment variables
validate_env() {
    echo -e "${BLUE}🔧 Validating environment configuration...${NC}"
    
    if [ ! -f .env ]; then
        echo -e "${RED}❌ .env file not found${NC}"
        echo -e "${YELLOW}📝 Creating .env from example...${NC}"
        cp .env.example .env
        echo -e "${YELLOW}⚠️ Please configure .env file before starting the server${NC}"
        return 1
    fi
    
    # Check required environment variables
    source .env
    
    REQUIRED_VARS=("MONGODB_URI" "JWT_SECRET" "RESEND_API_KEY" "FROM_EMAIL")
    MISSING_VARS=()
    
    for var in "${REQUIRED_VARS[@]}"; do
        if [ -z "${!var}" ]; then
            MISSING_VARS+=($var)
        fi
    done
    
    if [ ${#MISSING_VARS[@]} -gt 0 ]; then
        echo -e "${RED}❌ Missing required environment variables:${NC}"
        for var in "${MISSING_VARS[@]}"; do
            echo -e "${RED}   - $var${NC}"
        done
        return 1
    fi
    
    echo -e "${GREEN}✅ Environment configuration is valid${NC}"
    return 0
}

# Create systemd service (Linux only)
create_systemd_service() {
    if [ "$OSTYPE" == "linux-gnu"* ]; then
        echo -e "${BLUE}🔧 Creating systemd service...${NC}"
        
        SERVICE_FILE="/etc/systemd/system/metro-sevilla-backend.service"
        WORK_DIR=$(pwd)
        USER=$(whoami)
        
        sudo tee $SERVICE_FILE > /dev/null << EOF
[Unit]
Description=Metro de Sevilla Backend API
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$WORK_DIR
ExecStart=/usr/bin/node src/server.js
Restart=always
RestartSec=5
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF
        
        sudo systemctl daemon-reload
        sudo systemctl enable metro-sevilla-backend
        
        echo -e "${GREEN}✅ Systemd service created and enabled${NC}"
        echo -e "${BLUE}   Start with: sudo systemctl start metro-sevilla-backend${NC}"
        echo -e "${BLUE}   Check status: sudo systemctl status metro-sevilla-backend${NC}"
    else
        echo -e "${YELLOW}⚠️ Systemd service creation skipped (not on Linux)${NC}"
    fi
}

# Security check
security_check() {
    echo -e "${BLUE}🔒 Running security checks...${NC}"
    
    # Check if .env is in .gitignore
    if grep -q "\.env" .gitignore; then
        echo -e "${GREEN}✅ .env file is properly ignored by git${NC}"
    else
        echo -e "${YELLOW}⚠️ .env file should be added to .gitignore${NC}"
    fi
    
    # Check file permissions
    if [ -f .env ]; then
        PERM=$(stat -c "%a" .env 2>/dev/null || stat -f "%A" .env 2>/dev/null)
        if [ "$PERM" = "600" ] || [ "$PERM" = "0600" ]; then
            echo -e "${GREEN}✅ .env file has secure permissions${NC}"
        else
            echo -e "${YELLOW}⚠️ Setting secure permissions for .env file${NC}"
            chmod 600 .env
        fi
    fi
    
    echo -e "${GREEN}✅ Security checks completed${NC}"
}

# Main setup process
main() {
    check_node
    install_deps
    
    if validate_env; then
        security_check
        
        echo -e "${BLUE}🚀 Production setup options:${NC}"
        echo "1. Create systemd service (Linux)"
        echo "2. Skip service creation"
        read -p "Choose option (1/2): " choice
        
        case $choice in
            1)
                create_systemd_service
                ;;
            2)
                echo -e "${BLUE}📝 Manual start: npm start${NC}"
                ;;
            *)
                echo -e "${YELLOW}⚠️ Invalid choice. Skipping service creation.${NC}"
                ;;
        esac
        
        echo ""
        echo -e "${GREEN}🎉 Production setup completed!${NC}"
        echo -e "${BLUE}📝 Next steps:${NC}"
        echo "   1. Review and configure .env file"
        echo "   2. Start the server: npm start"
        echo "   3. Test the API: curl http://localhost:5000"
        
    else
        echo -e "${RED}❌ Setup failed. Please fix environment configuration.${NC}"
        exit 1
    fi
}

# Show help
show_help() {
    echo -e "${BLUE}Metro de Sevilla Backend - Production Setup${NC}"
    echo ""
    echo "This script helps you set up the backend for production deployment."
    echo ""
    echo "What it does:"
    echo "• Checks Node.js version compatibility"
    echo "• Installs production dependencies"
    echo "• Validates environment configuration"
    echo "• Sets up security permissions"
    echo "• Optionally creates systemd service (Linux)"
    echo ""
    echo "Usage: ./scripts/production-setup.sh"
}

# Script entry point
case "$1" in
    "help"|"-h"|"--help")
        show_help
        ;;
    *)
        main
        ;;
esac
