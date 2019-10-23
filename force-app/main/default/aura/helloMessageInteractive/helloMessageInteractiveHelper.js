({
	craftMessage : function(component, btnLabel) {
        if (btnLabel === "My name is Inigo Montoya. You killed my father! Prepare to die.") {
            btnLabel =  'Hello! ' + btnLabel;
        } 
        component.set("v.message", btnLabel);   
	}
})