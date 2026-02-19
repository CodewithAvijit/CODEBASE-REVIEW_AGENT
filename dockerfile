FROM maven:3.9.6-eclipse-temurin-21 AS build_base
WORKDIR /app

COPY pom.xml .

FROM openjdk:25-ea-jdk-oracle AS build
WORKDIR /app

COPY --from=build_base /usr/share/maven /usr/share/maven
COPY --from=build_base /usr/bin/mvn /usr/bin/mvn

ENV MAVEN_HOME=/usr/share/maven
ENV PATH=$MAVEN_HOME/bin:$PATH

COPY . .

RUN mvn clean package -DskipTests

FROM openjdk:25-ea-jdk-oracle
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8000

ENTRYPOINT ["java", "-jar", "app.jar"]