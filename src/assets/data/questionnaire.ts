export const data =[
	{
        "id":"1", "fieldname":"name", "type":"text",  "answer":"", "opt":"",  "textlabel":"", 
        "question": "What's your name?", "answers":[]
    },
	{
        "id":"2","fieldname":"name", "type":"option",
        "question": "Gender", "answer":"", "answers":[
        {"name":"q1", "value":"c1", "text":"Male", "subtext":"", },
        {"name":"q1", "value":"c2", "text":"Female", "subtext":""}
        ]
    },
    {
        "id":"3","fieldname":"goal", "type":"option",
        "question": "What is your goal?", "answer":"", "answers":[
        {"name":"q2", "value":"c1", "text":"Loose Weight", "subtext":""},
        {"name":"q2", "value":"c2", "text":"Gain Weight", "subtext":""},
        {"name":"q2", "value":"c3", "text":"Maintain Weight", "subtext":""}
        ]
    },
    {
        "id":"4","fieldname":"activity", "type":"option",
        "question": "How active you are?", "answer":"","answers":[
        {"name":"q3", "value":"c1", "text":"Sedentary", "subtext":"fewer than 5,000 steps a day"},
        {"name":"q3", "value":"c2", "text":"Moderate", "subtext":"between 7,500 and 10,000 steps"},
        {"name":"q3", "value":"c3", "text":"Highly Active", "subtext":"more than 12,500 steps each day "},
        ]
    },
    {
        "id":"5","fieldname":"sensitivity", "type":"checkbox", "answer":"",
        "question": "Sensitivities/Allergies?", "answers":[
        {"name":"q8", "value":"c1", "text":"Milk", "subtext":""},
        {"name":"q8", "value":"c2", "text":"Egg", "subtext":""},
        {"name":"q8", "value":"c3", "text":"Tree-Nut", "subtext":""},
        {"name":"q8", "value":"c4", "text":"Peanut", "subtext":""},
		{"name":"q8", "value":"c5", "text":"Shellfish", "subtext":""},
		{"name":"q8", "value":"c6", "text":"Wheat", "subtext":""},
		{"name":"q8", "value":"c7", "text":"Soy", "subtext":""},
		{"name":"q8", "value":"c8", "text":"Fish", "subtext":""}
        ]
    },
    {
        "id":"6","fieldname":"preferred", "type":"checkbox",
        "question": "What's your recommended diet?", "answers":[
        {"name":"q9", "value":"c1", "text":"Balanced", "subtext":"Protein/Fat/Carb values in 15/35/50 ratio"},
        {"name":"q9", "value":"c2", "text":"High-Fiber", "subtext":"More than 5g fiber per serving"},
        {"name":"q9", "value":"c3", "text":"High-Protein", "subtext":"More than 50% of total calories from proteins"},
        {"name":"q9", "value":"c4", "text":"Low-Carb", "subtext":"Less than 20% of total calories from carbs"},
		{"name":"q9", "value":"c5", "text":"Low-Fat", "subtext":"Less than 15% of total calories from fat"},
		{"name":"q9", "value":"c6", "text":"Low-Sodium", "subtext":"Less than 140mg Na per serving"}
        ]
    },
    {
        "id":"7", "fieldname":"age", "type":"text",  "answer":"", "opt":"Years",  "textlabel":"Years", 
        "question": "What's your age?", "answers":[]
    },
    {
        "id":"8", "fieldname":"height", "type":"text", "answer":"", "opt":"Inch", "options":[{"name":"Inch", "selected":true},{"name":"Cm", "selected":false}], 
        "question": "What's your height?", "answers":[]
    },
    {
        "id":"9","fieldname":"weight", "type":"text",  "answer":"","opt":"Kg", "options":[{"name":"Kg", "selected":true},{"name":"Lbs", "selected":false}], 
        "question": "What's your weight?", "answers":[]
    }
    ]

