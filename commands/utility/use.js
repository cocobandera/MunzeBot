const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

const inventoryFile = './inventories.json';

function loadInventory() {
    return JSON.parse(fs.readFileSync(inventoryFile, 'utf8'));
}

function saveInventory(data) {
    fs.writeFileSync(inventoryFile, JSON.stringify(data, null, 2), 'utf8');
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('use')
        .setDescription('Использовать предмет из инвентаря')
        .addStringOption(option =>
            option.setName('item')
                .setDescription('Название предмета')
                .setRequired(true)
        ),
    async execute(interaction) {
        const userId = interaction.user.id;
        const itemName = interaction.options.getString('item');
        const inventory = loadInventory();

        if (!inventory[userId] || !inventory[userId].includes(itemName)) {
            return interaction.reply('❌ У вас нет этого предмета.');
        }

        inventory[userId] = inventory[userId].filter(i => i !== itemName);
        saveInventory(inventory);

        interaction.reply(`✅ Вы использовали **${itemName}**.`);
    },
};
