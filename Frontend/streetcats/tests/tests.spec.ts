import { test, expect, request } from '@playwright/test';
import FormData from 'form-data';
import https from 'https';
import path from 'path';
import fs from 'fs';
import axios from 'axios';

const baseUrl = 'https://localhost:4200';
const backendUrl = 'https://localhost:3000';
const delUsr = baseUrl + '/users?username='

// NOTE
// await page.waitForSelector('#some-element');

const userTest = {
  usr: "userTest",
  pwd: "password",
  jwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoidXNlclRlc3QiLCJpYXQiOjE3NTA2MjA5ODcsImV4cCI6MTc1MTA1Mjk4N30.7N26jyeSIo2BXb1yJ26hzaSMI0NdI9345IvFxTe-rTI"
};

let catTest;

const httpsAgent = new https.Agent({
  rejectUnauthorized: false
});

test.beforeEach(async ({ page, request }) => {
  await page.goto('/', { timeout: 50_000 });

  expect(await resetTestUser(request)).toBe(true); // Elimino (eventuiali) e Registro
  const res = await addCatAPI();
  expect(res.status).toBe(200);
  catTest = await res.data;

});

// afterEach

// // TEST 1
test("Success Add Cat", async ({ page, request }) => {

  await login(page);

  await page.locator('a[routerLink="/add-cat"]').first().click();

  await expect(page).toHaveTitle("Upload Cat | Street Cats");

  await page.locator('#title').fill('Gattino Test');
  await page.locator('#longitudine').fill('14.2681');
  await page.locator('#latitudine').fill('40.8518');

  await page.evaluate(() => {
    const el = document.querySelector('[formcontrolname="description"]') as HTMLInputElement;
    if (el) el.value = 'Questo è un **gattino randagio** test.';
  });


  await page.setInputFiles('#image', 'tests/img/gatto1.jpg');

  await page.locator(".btn-submit").click();

  await expect(page).toHaveTitle("Street Cats");

});

// TEST 2
test("Unauth comment", async ({ page }) => {

  // Assicuriamoci che il gatto sia effettivamente presente
  await page.waitForSelector('.cats-container', { state: 'visible' });

  await page.locator('img.cat-photo').first().click();

  await page.locator('button.comment-button').click();

  await expect(page).toHaveTitle("Login | Street Cats");

});

// TEST 3
test("Success del cat", async ({ page }) => { 

  await login(page);

  await page.locator('a[routerLink="/mycats"]').first().click();

  await expect(page).toHaveTitle("Profile | Street Cats");

  await page.locator('.btn-del-cat').first().click();

  const msg = await page.locator("#no-cat-msg")

  await expect(page).toHaveTitle("Profile | Street Cats");

  await expect(msg).toContainText('Nessun gatto registrato');

});

// TEST 4
test("Success del user", async ({ page }) => { 

  await login(page);

  await page.locator('a[routerLink="/mycats"]').first().click();

  await expect(page).toHaveTitle("Profile | Street Cats");

  await page.locator('#btn-del-profile').click();

  await expect(page).toHaveTitle("Street Cats");

});

// TEST 5
test("Success add comment", async ({ page }) => {

  await login(page);

  await page.waitForSelector('.cats-container', { state: 'visible' }); // Assicuriamoci che il gatto sia effettivamente presente
  const catCard = page.locator('.cat-card', { hasText: 'title of test cat' }).first();
  await expect(catCard).toBeVisible();

  const catPhoto = catCard.locator('img.cat-photo');
  await expect(catPhoto).toBeVisible();
  await catPhoto.scrollIntoViewIfNeeded();
  await catPhoto.click();

  await expect(page).toHaveTitle("Cat | Street Cats");

  await page.locator('button.comment-button').click();

  await page.locator('#inpt-comment').fill("COMMENT TEST");

  await page.locator(".btn-confirm").first().click();

  const msg = await page.locator(".comments-section .comment-content").last(); // Aspetta che il commento appaia nella lista
  await page.waitForTimeout(2000);

  expect(msg).toContainText("COMMENT TEST");

});


// TEST 6
test("Fail overflow comment", async ({ page }) => {

  await login(page);

  await page.waitForSelector('.cats-container', { state: 'visible' }); // Assicuriamoci che il gatto sia effettivamente presente
  const catCard = page.locator('.cat-card').first();
  await expect(catCard).toBeVisible();

  const catPhoto = catCard.locator('img.cat-photo');
  await expect(catPhoto).toBeVisible();
  await catPhoto.scrollIntoViewIfNeeded();
  await catPhoto.click();

  await expect(page).toHaveTitle("Cat | Street Cats");

  await page.locator('button.comment-button').click();

  await page.locator('#inpt-comment').fill("\
      La luna rifletteva sul vetro appannato del tram, mentre un uomo con un cappello \
      viola leggeva un libro senza titolo. Un gatto attraversò la strada, inosservato. \
      Una radio gracchiava jazz lontano, e il tempo sembrava fermarsi tra sogni e respiri lenti.\
    ");

  // await page.locator(".comment-actions .btn-cancel").first();
  // await page.waitForTimeout(2000);

  // const delBtn = await page.locator(".comment-actions .btn-cancel").first().click();
  // expect(page).toContein(delBtn);
  const confirmBtn = page.locator(".btn-confirm");
  await confirmBtn.first().click();

  await page.waitForTimeout(2000);

  const cancelBtn = page.locator(".comment-actions .btn-cancel");
  await expect(cancelBtn).toBeVisible();

});

// TEST 7
test("Fail wrong cords", async ({ page }) => {

  await login(page);

  await page.locator('a[routerLink="/add-cat"]').first().click();

  await expect(page).toHaveTitle("Upload Cat | Street Cats");

  await page.locator('#title').fill('Gattino Test');
  const lngField = await page.locator('#longitudine'); //180
  const latField = await page.locator('#latitudine'); //90
  const addBtn = await page.locator(".btn-submit");

  await lngField.fill('1800');
  await latField.fill('50');
  await addBtn.click();
  const err = page.locator('.error-form');
  await expect(err).toBeVisible();
  await expect(err).toContainText("La longitudine deve essere ≤ 180");

  await lngField.fill('-1800');
  await addBtn.click();
  await expect(err).toBeVisible();
  await expect(err).toContainText("La longitudine deve essere ≥ -180");

  await lngField.fill('50');
  await latField.fill('900');
  await addBtn.click();
  await expect(err).toBeVisible();
  await expect(err).toContainText("La latitudine deve essere ≤ 90");

  await latField.fill('-900');
  await addBtn.click();
  await expect(err).toBeVisible();
  await expect(err).toContainText("La latitudine deve essere ≥ -90");

});

// TEST 8 
// /HEREEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE
test("Fail wrong cords", async ({ page }) => {
  
});

// TEST 9

// TEST 10
// test("Success Signup & Login", async ({ page, request }) => {

//   await delUserAPI(request);

//   await signup(page);

//   await login(page);

//   await delUser(page);

// });

// ======== FUNCTIONS ========

async function signup(page) {

  await page.locator('a[routerLink="/signup"]').first().click({ timeout: 50_000 });

  await expect(page).toHaveTitle("Signup | Street Cats");

  await page.locator("#user").fill(userTest.usr);

  await page.locator("#pass").fill(userTest.pwd);

  await page.locator('button', { hasText: 'Sign up' }).click({ timeout: 50_000 });

  await expect(page).toHaveTitle("Login | Street Cats");

}

async function login(page) {

  await page.locator('a[routerLink="/login"]').first().click({ timeout: 50_000 });

  await page.locator("#user").fill(userTest.usr);

  await page.locator("#pass").fill(userTest.pwd);

  await page.locator('button', { hasText: 'Sign in' }).click({ timeout: 50_000 });

  await expect(page).toHaveTitle("Street Cats");

}

async function delUser(page) {
  await page.locator('a[routerLink="/mycats"]').first().click();

  await expect(page).toHaveTitle("Profile | Street Cats");

  await page.locator('#btn-del-profile').click();

  await page.waitForTimeout(2000);

  await expect(page).toHaveTitle("Street Cats");
}

async function resetTestUser(request) {

  // Elimino eventuali istanze
  const deleteResponse = await request.delete(`${backendUrl}/users?username=${userTest.usr}`, {
    headers: {
      Authorization: `Bearer ${userTest.jwt}`
    }
  });

  // console.log("delete user: ", deleteResponse.status());

  // Registro dinuovo
  const signupResponse = await request.post(`${backendUrl}/signup`, {
    data: {
      usr: userTest.usr,
      pwd: userTest.pwd
    }
  });
  // console.log("signup:\n", signupResponse.status());
  if (!signupResponse.ok()) {
    // console.error("Errore durante la registrazione dell’utente.");
    return false;
  }

  // console.log("Utente registrato con successo.");
  return true;
}

async function delUserAPI(request) {
  const deleteResponse = await request.delete(`${backendUrl}/users?username=${userTest.usr}`, {
    headers: {
      Authorization: `Bearer ${userTest.jwt}`
    }
  });

  return deleteResponse;
}

async function addCatAPI() {
  const form = new FormData();
  form.append('title', 'title of test cat');
  form.append('longitudine', '40');
  form.append('latitudine', '20');
  form.append('description', '# TEST');
  form.append('immagine', fs.createReadStream('tests/img/gatto1.jpg'));

  const headers = {
    ...form.getHeaders(),
    Authorization: `Bearer ${userTest.jwt}`
  };

  const response = await axios.post(`${backendUrl}/cats`, form, {
    httpsAgent,
    headers,
    maxContentLength: Infinity,
    maxBodyLength: Infinity
  });

  return response;
}