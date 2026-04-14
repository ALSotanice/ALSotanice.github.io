const COLORS  = ['#22c55e','#ef4444','#3b82f6','#f59e0b','#a855f7'];
const AVATARS = ['👾','🔴','🔵','🟡','🟣'];

const files = {
    'main.game.js': { content:`// Coding Phase!\nfunction startGame() {\n    console.log("🎮 Game started!");\n}`, lang:'javascript', icon:'🟦' },
    'script.py':    { content:`# Python game logic\ndef run():\n    print("Hello Python!")`, lang:'python', icon:'🐍' },
    'Main.java':    { content:`public class Main {\n    public static void main(String[] a) {\n        System.out.println("Java!");\n    }\n}`, lang:'java', icon:'☕' },
    'game.cpp':     { content:`#include<iostream>\nusing namespace std;\nint main(){\n    cout<<"C++"<<endl;\n}`, lang:'cpp', icon:'⚙️' }
};

const PUBLIC_ROOMS = [
    { id:'123456', name:'Battle Royale #001', cur:3, max:5 },
    { id:'789012', name:'Code Duel #042', cur:1, max:5 },
    { id:'345678', name:'Speed Code VIP', cur:4, max:5 },
];
