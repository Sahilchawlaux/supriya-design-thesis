#!/usr/bin/env node

/**
 * Auth Cleanup Script
 * Clears Supabase authentication tokens from localStorage
 * Run this when development server stops to prevent token conflicts
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧹 Cleaning up authentication tokens...');

// Create a simple HTML file that clears localStorage and closes itself
const cleanupHTML = `
<!DOCTYPE html>
<html>
<head>
    <title>Auth Cleanup</title>
</head>
<body>
    <script>
        // Clear all Supabase-related localStorage items
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && (key.startsWith('supabase.') || key.includes('auth'))) {
                keysToRemove.push(key);
            }
        }
        
        keysToRemove.forEach(key => {
            localStorage.removeItem(key);
            console.log('Removed localStorage key:', key);
        });
        
        // Clear sessionStorage too
        const sessionKeysToRemove = [];
        for (let i = 0; i < sessionStorage.length; i++) {
            const key = sessionStorage.key(i);
            if (key && (key.startsWith('supabase.') || key.includes('auth'))) {
                sessionKeysToRemove.push(key);
            }
        }
        sessionKeysToRemove.forEach(key => sessionStorage.removeItem(key));
        
        console.log('✅ Auth tokens cleared successfully!');
        document.body.innerHTML = '<h2>Auth tokens cleared! You can close this tab.</h2>';
        
        // Auto-close after 2 seconds
        setTimeout(() => {
            window.close();
        }, 2000);
    </script>
    <h2>Cleaning up authentication tokens...</h2>
</body>
</html>
`;

// Write the cleanup HTML file
const cleanupPath = path.join(__dirname, '..', 'public', 'cleanup-auth.html');
fs.writeFileSync(cleanupPath, cleanupHTML);

console.log('✅ Cleanup script created at public/cleanup-auth.html');
console.log('📖 To manually clear tokens, visit: http://localhost:8080/cleanup-auth.html');
console.log('🔄 Or run: npm run cleanup-auth');
