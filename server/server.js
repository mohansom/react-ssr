const express = require('express')
const fs = require('fs');
const path = require('path');
const serverEntry = require('../dist/server/server-entry')

const app = express()

app.get('*',(req, res) => {
    
})