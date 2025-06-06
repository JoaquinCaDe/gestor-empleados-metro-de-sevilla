#!/bin/bash
# Metro de Sevilla Backend Development Scripts

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if backend is running
check_backend() {
    echo -e "${BLUE}🔍 Checking if backend is running...${NC}"
    if curl -s http://localhost:5000 > /dev/null; then
        echo -e "${GREEN}✅ Backend is running on port 5000${NC}"
        return 0
    else
        echo -e "${RED}❌ Backend is not running${NC}"
        return 1
    fi
}

# Start backend server
start_backend() {
    echo -e "${BLUE}🚀 Starting backend server...${NC}"
    npm start
}

# Run all tests
run_tests() {
    echo -e "${BLUE}🧪 Running all tests...${NC}"
    
    if ! check_backend; then
        echo -e "${YELLOW}⚠️ Backend not running. Please start it first with: npm start${NC}"
        return 1
    fi
    
    echo -e "${BLUE}Running real API test...${NC}"
    node tests/real-test.js
    
    echo -e "${BLUE}Running simple scheduler test...${NC}"
    node tests/simple-test.js
    
    echo -e "${GREEN}✅ All tests completed${NC}"
}

# Run quick test (just the real API test)
quick_test() {
    echo -e "${BLUE}⚡ Running quick test...${NC}"
    
    if ! check_backend; then
        echo -e "${YELLOW}⚠️ Backend not running. Please start it first with: npm start${NC}"
        return 1
    fi
    
    node tests/real-test.js
}

# Setup development environment
setup_dev() {
    echo -e "${BLUE}🔧 Setting up development environment...${NC}"
    
    # Install dependencies
    echo -e "${BLUE}Installing dependencies...${NC}"
    npm install
    
    # Check .env file
    if [ ! -f .env ]; then
        echo -e "${YELLOW}⚠️ .env file not found. Copying from .env.example...${NC}"
        cp .env.example .env
        echo -e "${YELLOW}📝 Please edit .env file with your configuration${NC}"
    fi
    
    echo -e "${GREEN}✅ Development environment setup complete${NC}"
}

# Show help
show_help() {
    echo -e "${BLUE}Metro de Sevilla Backend Development Scripts${NC}"
    echo ""
    echo "Usage: ./scripts/dev.sh [command]"
    echo ""
    echo "Commands:"
    echo "  start       - Start the backend server"
    echo "  test        - Run all tests (requires backend to be running)"
    echo "  quick       - Run quick API test only"
    echo "  check       - Check if backend is running"
    echo "  setup       - Setup development environment"
    echo "  help        - Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./scripts/dev.sh start"
    echo "  ./scripts/dev.sh test"
    echo "  ./scripts/dev.sh quick"
}

# Main script logic
case "$1" in
    "start")
        start_backend
        ;;
    "test")
        run_tests
        ;;
    "quick")
        quick_test
        ;;
    "check")
        check_backend
        ;;
    "setup")
        setup_dev
        ;;
    "help"|"")
        show_help
        ;;
    *)
        echo -e "${RED}❌ Unknown command: $1${NC}"
        show_help
        exit 1
        ;;
esac
