import RelocateAttachmentModal from 'modals/RelocateAttachmentModal';
import { Menu, Plugin, TAbstractFile } from 'obsidian';

interface AttachmentManagerPluginSettings {}

const DEFAULT_SETTINGS: AttachmentManagerPluginSettings = {}

export default class AttachmentManagerPlugin extends Plugin {
	settings: AttachmentManagerPluginSettings;
	async onload() {
		await this.loadSettings();
		const plugin = this
		const onFileMenu = (menu: Menu, file: TAbstractFile) => {
			menu.addItem(item => {
				item.setTitle("Relocate Attachment")
					.setIcon("text-cursor-input")
					.onClick(async () => {
						new RelocateAttachmentModal(plugin.app, file,async (newPath) => {
							const folderPath = newPath.substring(0,newPath.lastIndexOf("/"))
							const adapter = plugin.app.vault.adapter
							if (!await adapter.exists(folderPath))
								await adapter.mkdir(folderPath)
							plugin.app.fileManager.renameFile(file, newPath)
						}).open()
					})
			})
		}
		plugin.app.workspace.on("file-menu", onFileMenu)
		plugin.register(() => {
			plugin.app.workspace.off("file-menu", onFileMenu)
		})
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}