import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export default function Stats() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [workSessions, setWorkSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchStats();
      fetchWorkSessions();
    }
  }, [session]);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkSessions = async () => {
    try {
      const response = await fetch("/api/work-sessions");
      if (response.ok) {
        const data = await response.json();
        setWorkSessions(data.slice(0, 10)); // Last 10 sessions
      }
    } catch (error) {
      console.error("Error fetching work sessions:", error);
    }
  };

  if (status === "loading" || loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </Layout>
    );
  }

  if (!session || !stats) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-500">No statistics available yet.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Your Statistics</h2>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="flex items-center gap-4">
              <div className="text-2xl">⏰</div>
              <div>
                <Badge variant="secondary" className="mb-1">
                  Hours This Week
                </Badge>
                <div className="text-3xl font-bold text-blue-600">
                  {stats.weeklyHours}h
                </div>
                <div className="text-sm text-gray-600">Time invested</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4">
              <div className="text-2xl">📅</div>
              <div>
                <Badge variant="secondary" className="mb-1">
                  Hours This Month
                </Badge>
                <div className="text-3xl font-bold text-green-600">
                  {stats.monthlyHours}h
                </div>
                <div className="text-sm text-gray-600">Monthly progress</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4">
              <div className="text-2xl">✅</div>
              <div>
                <Badge variant="secondary" className="mb-1">
                  Completion Rate
                </Badge>
                <div className="text-3xl font-bold text-purple-600">
                  {stats.completionRate}%
                </div>
                <div className="text-sm text-gray-600">Success rate</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4">
              <div className="text-2xl">🎯</div>
              <div>
                <Badge variant="secondary" className="mb-1">
                  Tasks Completed
                </Badge>
                <div className="text-3xl font-bold text-orange-600">
                  {stats.completedTasks}
                </div>
                <div className="text-sm text-gray-600">Total finished</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <Card>
            <CardHeader>
              <CardTitle>📊 Productivity Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-gray-700">Average daily focus time</span>
                <span className="font-semibold text-blue-600">
                  {(stats.weeklyHours / 7).toFixed(1)}h
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-gray-700">Tasks completed this week</span>
                <span className="font-semibold text-green-600">
                  {stats.completedTasksThisWeek}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span className="text-gray-700">Overall success rate</span>
                <span className="font-semibold text-purple-600">
                  {stats.completionRate}%
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <span className="text-gray-700">Tasks remaining</span>
                <span className="font-semibold text-orange-600">
                  {stats.totalTasks - stats.completedTasks}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🕐 Recent Work Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              {workSessions.length > 0 ? (
                <div className="space-y-3">
                  {workSessions.map((session, index) => (
                    <Card key={session.id} className="p-2">
                      <CardContent className="p-2 flex justify-between items-center">
                        <div>
                          <div className="font-medium text-sm text-gray-900">
                            {session.task?.title || "Unknown Task"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(session.startTime).toLocaleDateString()}{" "}
                            at{" "}
                            {new Date(session.startTime).toLocaleTimeString(
                              [],
                              { hour: "2-digit", minute: "2-digit" }
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-blue-600">
                            {session.duration.toFixed(1)}h
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No work sessions yet
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Progress Overview */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>🎯 Progress Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {stats.totalTasks}
                </div>
                <div className="text-sm text-gray-500 mb-3">
                  Total Tasks Created
                </div>
                <Progress value={100} className="h-2" />
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {stats.completedTasks}
                </div>
                <div className="text-sm text-gray-500 mb-3">
                  Tasks Completed
                </div>
                <Progress
                  value={stats.completionRate}
                  className="h-2 bg-green-500"
                />
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-600 mb-2">
                  {stats.totalTasks - stats.completedTasks}
                </div>
                <div className="text-sm text-gray-500 mb-3">
                  Tasks Remaining
                </div>
                <Progress
                  value={100 - stats.completionRate}
                  className="h-2 bg-orange-500"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
