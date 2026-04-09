import apiService from './api.service';
import { LeaderboardEntry, Guild } from '@/types';

class RankingService {
  // Mock leaderboard data
  private mockPvPLeaderboard: LeaderboardEntry[] = [
    {
      rank: 1,
      characterName: 'Arthas',
      characterGuid: 1,
      race: 1,
      class: 2,
      level: 80,
      score: 2850,
      guildName: 'Knights of the Silver Hand',
      faction: 'alliance',
    },
    {
      rank: 2,
      characterName: 'Sylvanas',
      characterGuid: 2,
      race: 5,
      class: 3,
      level: 80,
      score: 2720,
      guildName: 'Forsaken Legion',
      faction: 'horde',
    },
    {
      rank: 3,
      characterName: 'Jaina',
      characterGuid: 4,
      race: 1,
      class: 8,
      level: 80,
      score: 2650,
      guildName: 'Kirin Tor',
      faction: 'alliance',
    },
    {
      rank: 4,
      characterName: 'Thrall',
      characterGuid: 3,
      race: 2,
      class: 7,
      level: 75,
      score: 2480,
      guildName: 'Horde Vanguard',
      faction: 'horde',
    },
  ];

  private mockPvELeaderboard: LeaderboardEntry[] = [
    {
      rank: 1,
      characterName: 'Jaina',
      characterGuid: 4,
      race: 1,
      class: 8,
      level: 80,
      score: 12450,
      guildName: 'Kirin Tor',
      faction: 'alliance',
    },
    {
      rank: 2,
      characterName: 'Arthas',
      characterGuid: 1,
      race: 1,
      class: 2,
      level: 80,
      score: 12200,
      guildName: 'Knights of the Silver Hand',
      faction: 'alliance',
    },
    {
      rank: 3,
      characterName: 'Sylvanas',
      characterGuid: 2,
      race: 5,
      class: 3,
      level: 80,
      score: 11850,
      guildName: 'Forsaken Legion',
      faction: 'horde',
    },
    {
      rank: 4,
      characterName: 'Thrall',
      characterGuid: 3,
      race: 2,
      class: 7,
      level: 75,
      score: 9200,
      guildName: 'Horde Vanguard',
      faction: 'horde',
    },
  ];

  private mockGuilds: Guild[] = [
    {
      id: 1,
      name: 'Knights of the Silver Hand',
      leaderName: 'Arthas',
      memberCount: 125,
      level: 25,
      faction: 'alliance',
      createdAt: '2024-01-15T10:00:00Z',
    },
    {
      id: 2,
      name: 'Forsaken Legion',
      leaderName: 'Sylvanas',
      memberCount: 98,
      level: 25,
      faction: 'horde',
      createdAt: '2024-02-20T14:30:00Z',
    },
    {
      id: 3,
      name: 'Kirin Tor',
      leaderName: 'Jaina',
      memberCount: 87,
      level: 24,
      faction: 'alliance',
      createdAt: '2024-03-10T09:15:00Z',
    },
    {
      id: 4,
      name: 'Horde Vanguard',
      leaderName: 'Thrall',
      memberCount: 76,
      level: 23,
      faction: 'horde',
      createdAt: '2024-04-05T16:45:00Z',
    },
  ];

  async getPvPLeaderboard(limit: number = 50): Promise<LeaderboardEntry[]> {
    // if mock mode is disabled we try calling real API
    if (!apiService.isMockEnabled()) {
      try {
        const resp = await apiService.get<LeaderboardEntry[]>('/rankings/pvp', {
          params: { limit },
        });
        return resp.data.data || [];
      } catch (error) {
        console.error('PvP leaderboard API failed, falling back to mock:', error);
      }
    }

    await apiService.mockDelay(600);
    return this.mockPvPLeaderboard.slice(0, limit);
  }

  async getPvELeaderboard(limit: number = 50): Promise<LeaderboardEntry[]> {
    if (!apiService.isMockEnabled()) {
      try {
        const resp = await apiService.get<LeaderboardEntry[]>('/rankings/pve', {
          params: { limit },
        });
        return resp.data.data || [];
      } catch (error) {
        console.error('PvE leaderboard API failed, falling back to mock:', error);
      }
    }

    await apiService.mockDelay(600);
    return this.mockPvELeaderboard.slice(0, limit);
  }

  async getGuildRankings(limit: number = 50): Promise<Guild[]> {
    if (!apiService.isMockEnabled()) {
      try {
        const resp = await apiService.get<Guild[]>('/rankings/guilds', {
          params: { limit },
        });
        return resp.data.data || [];
      } catch (error) {
        console.error('Guild rankings API failed, falling back to mock:', error);
      }
    }

    await apiService.mockDelay(500);
    return this.mockGuilds
      .sort((a, b) => b.memberCount - a.memberCount)
      .slice(0, limit);
  }

  async searchCharacter(name: string): Promise<LeaderboardEntry | null> {
    if (!apiService.isMockEnabled()) {
      try {
        const resp = await apiService.get<LeaderboardEntry | null>('/rankings/search', {
          params: { name },
        });
        return resp.data.data || null;
      } catch (error) {
        console.error('Search API failed, falling back to mock:', error);
      }
    }

    await apiService.mockDelay(400);

    const allCharacters = [...this.mockPvPLeaderboard, ...this.mockPvELeaderboard];
    const character = allCharacters.find(
      c => c.characterName.toLowerCase() === name.toLowerCase()
    );

    return character || null;
  }
}

export default new RankingService();