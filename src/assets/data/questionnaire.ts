export const data =[{
        "id":"1","type":"option",
        "question": "Please choose gender", "answer":"", "answers":[
        {"name":"q1", "value":"c1", "text":"Male", "subtext":"", },
        {"name":"q1", "value":"c2", "text":"Female", "subtext":""}
        ]
    },
    {
        "id":"2","type":"option",
        "question": "What is your goal?", "answer":"", "answers":[
        {"name":"q2", "value":"c1", "text":"Loose Weight", "subtext":""},
        {"name":"q2", "value":"c2", "text":"Gain Weight", "subtext":""},
        {"name":"q2", "value":"c3", "text":"Maintain Weight", "subtext":""}
        ]
    },
    {
        "id":"3","type":"option",
        "question": "How active you are?", "answer":"","answers":[
        {"name":"q3", "value":"c1", "text":"Sedentary", "subtext":"fewer than 5,000 steps a day"},
        {"name":"q3", "value":"c2", "text":"Moderate", "subtext":"between 7,500 and 10,000 steps"},
        {"name":"q3", "value":"c3", "text":"Highly Active", "subtext":"more than 12,500 steps each day "},
        ]
    },
    {
        "id":"4", "type":"text",  "answer":"", "opt":"Years",  "textlabel":"Years", 
        "question": "What's your age?", "answers":[]
    },
    {
        "id":"5", "type":"text", "answer":"", "opt":"Inch", "options":[{"name":"Inch", "selected":true},{"name":"Cm", "selected":false}], 
        "question": "What's your height?", "answers":[]
    },
    {
        "id":"6", "type":"text",  "answer":"","opt":"Kg", "options":[{"name":"Kg", "selected":true},{"name":"Lbs", "selected":false}], 
        "question": "What's your weight?", "answers":[]
    },
    {
        "id":"7", "type":"text",  "answer":"","opt":"Kg", "options":[{"name":"Kg", "selected":true},{"name":"Lbs", "selected":false}],  
        "question": "What's your target weight?", "answers":[]
    },
    {
        "id":"8","type":"checkbox", "answer":"",
        "question": "Allergic to?", "answers":[
        {"name":"q8", "value":"c1", "text":"Wheat", "subtext":""},
        {"name":"q8", "value":"c2", "text":"Soy", "subtext":""},
        {"name":"q8", "value":"c3", "text":"Celery", "subtext":""},
        {"name":"q8", "value":"c4", "text":"Mushrooms", "subtext":""},
		{"name":"q8", "value":"c5", "text":"Peanut", "subtext":""},
		{"name":"q8", "value":"c5", "text":"Cocoa and chololate", "subtext":""}
        ]
    },
    {
        "id":"9","type":"checkbox",
        "question": "What's your recommended diet?", "answers":[
        {"name":"q9", "value":"c1", "text":"Balanced", "subtext":"Protein/Fat/Carb values in 15/35/50 ratio"},
        {"name":"q9", "value":"c2", "text":"High-Fiber", "subtext":"More than 5g fiber per serving"},
        {"name":"q9", "value":"c3", "text":"High-Protein", "subtext":"More than 50% of total calories from proteins"},
        {"name":"q9", "value":"c4", "text":"Low-Carb", "subtext":"Less than 20% of total calories from carbs"},
		{"name":"q9", "value":"c5", "text":"Low-Fat", "subtext":"Less than 15% of total calories from fat"},
		{"name":"q9", "value":"c5", "text":"Low-Sodium", "subtext":"Less than 140mg Na per serving"}
        ]
    }
    ]

