import { existsSync } from 'node:fs';
import { defineConfig } from '@playwright/test';
export default defineConfig({testDir:'./tests/browser',timeout:30000,workers:2,fullyParallel:true,use:{baseURL:'http://127.0.0.1:4186',launchOptions:{executablePath:process.env.CHROME_PATH || (existsSync('/opt/google/chrome/chrome')?'/opt/google/chrome/chrome':undefined),args:['--no-sandbox']},viewport:{width:1440,height:1000}},webServer:{command:'python3 -m http.server 4186 --bind 127.0.0.1 --directory public',url:'http://127.0.0.1:4186',reuseExistingServer:true},reporter:'list'});
