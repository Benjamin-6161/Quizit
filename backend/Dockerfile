FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

# Copy Maven wrapper and config
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Give execute permission to mvnw (fixes your error)
RUN chmod +x mvnw

# Pre-fetch dependencies (optional but speeds up build)
RUN ./mvnw dependency:go-offline

# Copy the source code
COPY src src

# Build the app
RUN ./mvnw clean package -DskipTests

EXPOSE 8080

# Render provides the PORT env variable automatically
CMD ["sh", "-c", "java -jar target/*.jar --server.port=$PORT"]