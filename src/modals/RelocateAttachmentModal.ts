import { App, Modal, Setting, TAbstractFile, TextComponent, moment } from "obsidian";

export default class RelocateAttachmentModal extends Modal {
    constructor(app: App, file: TAbstractFile, onSubmit: (name: string) => Promise<void>) {
        super(app)
        this.setTitle("Relocate Attachment")
        let path = file.path
        const suffix = path.substring(path.lastIndexOf(".")+1)
        let textComp: TextComponent;
        new Setting(this.contentEl)
            .setName("Path")
            .addText((text) => {
                textComp = text;
                text.setValue(path)
                text.onChange((value) => {
                    path = value
                })
                text.inputEl.style.width = "100%";
            })
            .addButton(btn=>{
                btn.setIcon("wand-sparkles")
                btn.onClick(()=>{
                    path = moment().format("[attachments]/YYYY/MM/[ATT-]YYYYMMDDHHmmssSSS")+`.${suffix}`
                    textComp.setValue(path)
                })
            })

        new Setting(this.contentEl)
            .addButton(btn => {
                btn.setButtonText("Cancel")
                    .onClick(() => {
                        this.close();
                    })
            })
            .addButton(btn => {
                btn.setButtonText("Submit")
                    .setCta()
                    .onClick(() => {
                        onSubmit(path)
                        this.close()
                    })
            })
    }
}