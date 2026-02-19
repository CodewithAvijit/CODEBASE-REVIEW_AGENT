// package com.bridge.cagent;

// import org.junit.jupiter.api.Test;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.resttestclient.TestRestTemplate;
// import org.springframework.boot.test.context.SpringBootTest;
// import org.springframework.boot.test.web.server.LocalServerPort;

// import static org.assertj.core.api.Assertions.assertThat;

// @SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
// class ControllerTests {

//     @LocalServerPort
//     int port;

//     @Autowired
//     TestRestTemplate restTemplate;

//     @Test
//     void testGithubLogin() {
//         var response = restTemplate.getForEntity(
//                 "http://localhost:" + port + "/login/github",
//                 String.class
//         );

//         assertThat(response.getStatusCode()).isEqualTo(302);
//     }
// }
