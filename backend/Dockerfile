# Use a lightweight Java image
FROM eclipse-temurin:17-jdk-alpine

# Set working directory inside container
WORKDIR /app

# Copy the Maven wrapper and pom.xml
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Download dependencies (for caching)
RUN ./mvnw dependency:go-offline

# Copy source code
COPY src src

# Package the app
RUN ./mvnw clean package -DskipTests

# Expose port 8080
EXPOSE 8080

# Run the jar file (Render provides PORT env var automatically)
CMD ["sh", "-c", "java -jar target/*.jar --server.port=$PORT"]