import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import TaskCard from "../../components/TaskCard";
import CreateTaskForm from "../../components/CreateTaskForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export default function WeeklyView() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchTasks();
    }
  }, [session, currentWeek]);

  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/tasks?view=weekly");
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const getWeekDays = () => {
    const days = [];
    const startOfWeek = new Date(currentWeek);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getTasksForDate = (date) => {
  const dateStr = date.toISOString().split('T')[0] // Get YYYY-MM-DD format
  return tasks.filter(task => {
    const taskDate = new Date(task.targetDate).toISOString().split('T')[0]
    return taskDate === dateStr
  })
}

  const navigateWeek = (direction) => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(newWeek.getDate() + direction * 7);
    setCurrentWeek(newWeek);
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

  if (!session) {
    return null;
  }

  const weekDays = getWeekDays();
  const weekStart = weekDays[0];
  const weekEnd = weekDays[6];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Weekly View</h2>
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => navigateWeek(-1)}>
              ← Previous Week
            </Button>
            <span className="text-lg font-medium">
              {weekStart.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}{" "}
              -{" "}
              {weekEnd.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <Button variant="outline" onClick={() => navigateWeek(1)}>
              Next Week →
            </Button>
          </div>
        </div>

        {/* Quick Add Task */}
        <CreateTaskForm onTaskCreated={fetchTasks} />

        {/* Weekly Calendar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
          {weekDays.map((day, index) => {
            const dayTasks = getTasksForDate(day);
            const isToday = day.toDateString() === new Date().toDateString();
            const dayNames = [
              "Sunday",
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
            ];

            return (
              <Card
                key={day.toISOString()}
                className={isToday ? "border-blue-400 shadow-lg" : ""}
              >
                <CardHeader className="pb-2">
                  <div className={isToday ? "text-blue-700" : "text-gray-900"}>
                    <div className="text-sm">{dayNames[index]}</div>
                    <div className="text-lg">{day.getDate()}</div>
                    {isToday && <Badge variant="secondary">Today</Badge>}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {dayTasks.map((task) => (
                      <Card
                        key={task.id}
                        className={`p-2 ${
                          task.completed ? "bg-green-50 border-green-200" : ""
                        }`}
                      >
                        <CardContent className="p-2">
                          <div
                            className={`font-medium ${
                              task.completed ? "line-through text-gray-500" : ""
                            }`}
                          >
                            {task.title}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {task.remainingHours.toFixed(1)}h remaining
                          </div>
                          {task.tags && task.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {task.tags.slice(0, 2).map((tag, i) => (
                                <Badge
                                  key={i}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {tag}
                                </Badge>
                              ))}
                              {task.tags.length > 2 && (
                                <span className="text-xs text-gray-400">
                                  +{task.tags.length - 2}
                                </span>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                    {dayTasks.length === 0 && (
                      <p className="text-gray-400 text-xs text-center py-4">
                        No tasks
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Week Summary */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Week Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {tasks.length}
                </div>
                <div className="text-sm text-gray-500">Total Tasks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {tasks.filter((t) => t.completed).length}
                </div>
                <div className="text-sm text-gray-500">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {tasks.filter((t) => !t.completed).length}
                </div>
                <div className="text-sm text-gray-500">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {tasks
                    .reduce(
                      (sum, t) => sum + (t.estimatedHours - t.remainingHours),
                      0
                    )
                    .toFixed(1)}
                  h
                </div>
                <div className="text-sm text-gray-500">Hours Worked</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
