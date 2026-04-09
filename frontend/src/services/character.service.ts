import apiService from './api.service';
import { Character, RACES, CLASSES } from '@/types';

class CharacterService {
  // Mock character database
  private mockCharacters: Character[] = [
    {
      guid: 1,
      name: 'Arthas',
      race: 1, // Human
      class: 2, // Paladin
      gender: 0, // Male
      level: 80,
      money: 1500000, // 150 gold in copper
      totaltime: 864000, // 10 days in seconds
      account: 1,
      online: true,
      zone: 4395,
      map: 571, // Northrend
      totalKills: 15420,
      arenaPoints: 2500,
      honorPoints: 45000,
    },
    {
      guid: 2,
      name: 'Sylvanas',
      race: 5, // Undead
      class: 3, // Hunter
      gender: 1, // Female
      level: 80,
      money: 980000,
      totaltime: 720000,
      account: 1,
      online: false,
      zone: 4080,
      map: 530,
      totalKills: 12350,
      arenaPoints: 1800,
      honorPoints: 32000,
    },
    {
      guid: 3,
      name: 'Thrall',
      race: 2, // Orc
      class: 7, // Shaman
      gender: 0,
      level: 75,
      money: 650000,
      totaltime: 432000,
      account: 2,
      online: false,
      zone: 4395,
      map: 571,
      totalKills: 8900,
      arenaPoints: 1200,
      honorPoints: 18000,
    },
    {
      guid: 4,
      name: 'Jaina',
      race: 1, // Human
      class: 8, // Mage
      gender: 1,
      level: 80,
      money: 1200000,
      totaltime: 950000,
      account: 2,
      online: true,
      zone: 4395,
      map: 571,
      totalKills: 11200,
      arenaPoints: 2100,
      honorPoints: 28000,
    },
  ];

  async getCharactersByAccount(accountId: number): Promise<Character[]> {
    await apiService.mockDelay(600);

    const characters = this.mockCharacters.filter(c => c.account === accountId);
    return characters;
  }

  async getCharacterByGuid(guid: number): Promise<Character | null> {
    await apiService.mockDelay(400);

    const character = this.mockCharacters.find(c => c.guid === guid);
    return character || null;
  }

  async getOnlineCharacters(): Promise<Character[]> {
    await apiService.mockDelay(300);

    return this.mockCharacters.filter(c => c.online);
  }

  // Helper methods to get character info
  getRaceName(raceId: number): string {
    return RACES[raceId as keyof typeof RACES]?.name || 'Unknown';
  }

  getClassName(classId: number): string {
    return CLASSES[classId as keyof typeof CLASSES]?.name || 'Unknown';
  }

  getClassColor(classId: number): string {
    return CLASSES[classId as keyof typeof CLASSES]?.color || '#FFFFFF';
  }

  getFaction(raceId: number): 'alliance' | 'horde' {
    return RACES[raceId as keyof typeof RACES]?.faction || 'alliance';
  }

  // Format money (copper to gold/silver/copper)
  formatMoney(copper: number): { gold: number; silver: number; copper: number } {
    const gold = Math.floor(copper / 10000);
    const silver = Math.floor((copper % 10000) / 100);
    const copperRemaining = copper % 100;

    return { gold, silver, copper: copperRemaining };
  }

  // Format playtime
  formatPlaytime(seconds: number): string {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (days > 0) {
      return `${days}d ${hours}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  }
}

export default new CharacterService();