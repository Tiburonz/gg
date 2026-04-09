import { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import rankingService from '@/services/ranking.service';
import characterService from '@/services/character.service';
import { LeaderboardEntry, Guild } from '@/types';
import { Trophy, Swords, Shield, Users } from 'lucide-react';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function Rankings() {
  const [pvpLeaderboard, setPvpLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [pveLeaderboard, setPveLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pvp, pve, guildData] = await Promise.all([
          rankingService.getPvPLeaderboard(50),
          rankingService.getPvELeaderboard(50),
          rankingService.getGuildRankings(20),
        ]);
        setPvpLeaderboard(pvp);
        setPveLeaderboard(pve);
        setGuilds(guildData);
      } catch (error) {
        console.error('Failed to fetch rankings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderLeaderboard = (entries: LeaderboardEntry[], scoreLabel: string) => (
    <div className="space-y-2">
      {entries.map((entry) => (
        <Card key={entry.characterGuid} className="card-wow ice-glow-hover">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg ${
                  entry.rank === 1 ? 'bg-yellow-500/20 text-yellow-400' :
                  entry.rank === 2 ? 'bg-gray-400/20 text-gray-300' :
                  entry.rank === 3 ? 'bg-orange-600/20 text-orange-400' :
                  'bg-wow-slate text-gray-400'
                }`}>
                  {entry.rank}
                </div>
                <div>
                  <p
                    className="text-lg font-bold"
                    style={{ color: characterService.getClassColor(entry.class) }}
                  >
                    {entry.characterName}
                  </p>
                  <p className="text-sm text-gray-400">
                    Level {entry.level} {characterService.getRaceName(entry.race)}{' '}
                    {characterService.getClassName(entry.class)}
                  </p>
                  {entry.guildName && (
                    <p className="text-xs text-gray-500 mt-1">
                      &lt;{entry.guildName}&gt;
                    </p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-wow-ice">{entry.score}</p>
                <p className="text-xs text-gray-400">{scoreLabel}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold gradient-text mb-4">Rankings</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Compete with the best players on Frostmourne
          </p>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <Tabs defaultValue="pvp" className="space-y-6">
            <TabsList className="bg-wow-slate border border-wow-ice/20 w-full justify-start">
              <TabsTrigger value="pvp" className="flex items-center space-x-2">
                <Swords className="w-4 h-4" />
                <span>PvP Arena</span>
              </TabsTrigger>
              <TabsTrigger value="pve" className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>PvE Achievements</span>
              </TabsTrigger>
              <TabsTrigger value="guilds" className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Top Guilds</span>
              </TabsTrigger>
            </TabsList>

            {/* PvP Tab */}
            <TabsContent value="pvp">
              <Card className="card-wow">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-6 h-6 text-wow-ice" />
                    <CardTitle>Arena Leaderboard</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  {renderLeaderboard(pvpLeaderboard, 'Arena Rating')}
                </CardContent>
              </Card>
            </TabsContent>

            {/* PvE Tab */}
            <TabsContent value="pve">
              <Card className="card-wow">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-6 h-6 text-wow-ice" />
                    <CardTitle>Achievement Leaderboard</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  {renderLeaderboard(pveLeaderboard, 'Achievement Points')}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Guilds Tab */}
            <TabsContent value="guilds">
              <Card className="card-wow">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Users className="w-6 h-6 text-wow-ice" />
                    <CardTitle>Top Guilds</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {guilds.map((guild, index) => (
                      <Card key={guild.id} className="card-wow ice-glow-hover">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg ${
                                index === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                                index === 1 ? 'bg-gray-400/20 text-gray-300' :
                                index === 2 ? 'bg-orange-600/20 text-orange-400' :
                                'bg-wow-slate text-gray-400'
                              }`}>
                                {index + 1}
                              </div>
                              <div>
                                <p className={`text-lg font-bold ${
                                  guild.faction === 'alliance' ? 'faction-alliance' : 'faction-horde'
                                }`}>
                                  {guild.name}
                                </p>
                                <p className="text-sm text-gray-400">
                                  Leader: {guild.leaderName}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-wow-ice">{guild.memberCount}</p>
                              <p className="text-xs text-gray-400">Members</p>
                              <p className="text-xs text-gray-500 mt-1">Level {guild.level}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </Layout>
  );
}