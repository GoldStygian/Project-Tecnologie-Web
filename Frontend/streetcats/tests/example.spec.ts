import { test, expect, request } from '@playwright/test';

const baseUrl = 'https://localhost:4200';
const delUsr = baseUrl + '/users?username='

const userTest = {
  usr: "userTest",
  pwd: "password"
};

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

// TEST 1
test("Success Signup & Login", async ({ page, request }) => {

  // console.log("URL", delUsr+userTest.usr);
  // const cleanupResp = await request.delete(delUsr+userTest.usr);
  // expect([204, 404]).toContain(cleanupResp.status());
  // console.log(cleanupResp, cleanupResp.status());

  // SIGN UP
  await page.locator('a[routerLink="/signup"]').first().click();
  // await page.getByRole('link', { name: 'Registrati' }).click();

  await expect(page).toHaveTitle("Signup | Street Cats");

  // await page.waitForSelector('#user');

  await page.locator("#user").fill(userTest.usr);

  await page.locator("#pass").fill(userTest.pwd);

  await page.locator('button', { hasText: 'Sign up' }).click(); 

  // LOGIN
  await expect(page).toHaveTitle("Login | Street Cats");

  await page.locator("#user").fill(userTest.usr);

  await page.locator("#pass").fill(userTest.pwd);

  await page.locator('button', { hasText: 'Sign in' }).click(); 

  // LOGIN via API per JWT
  const loginResp = await request.post(`${baseUrl}/auth`, {
    data: {
      usr: userTest.usr,
      pwd: userTest.pwd
    }
  });
  const loginData = await loginResp.json();
  const token = loginData.token;
  console.log("JWT ottenuto:", token);

  // // ELIMINO IL TEST USER
  console.log("URL", delUsr+userTest.usr);
  const delResp = await request.delete(baseUrl + '/users?username=' + userTest.usr, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  expect(delResp.status()).toBe(204);
});


// TEST 2
// test("Success Signup", async ({ page }) => {

//   await page.locator('a[routerLink="/signup"]').first().click();
//   // await page.getByRole('link', { name: 'Registrati' }).click();

//   await expect(page).toHaveTitle("Signup | Street Cats");

//   await page.waitForSelector('#user');

//   await page.locator("#user").fill(userTest.usr);

//   await page.locator("#pass").fill(userTest.pwd);

//   await page.locator('button', { hasText: 'Sign in' }).click(); 

//   await expect(page).toHaveTitle("Login | Street Cats");

//   await request.
// });