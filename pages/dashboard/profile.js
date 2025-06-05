import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Layout from "../../components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") {
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

  return (
    <Layout>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Profile</h2>

        {/* User Info */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {session.user.image && (
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={session.user.image} alt="Profile" />
                  <AvatarFallback>
                    {session.user.name?.[0] || session.user.email?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Badge variant="secondary">Profile Picture</Badge>
                  <p className="text-sm text-gray-500">
                    From your OAuth provider
                  </p>
                </div>
              </div>
            )}
            <div>
              <Badge variant="outline">Name</Badge>
              <p className="mt-1 text-lg text-gray-900">
                {session.user.name || "Not provided"}
              </p>
            </div>
            <div>
              <Badge variant="outline">Email</Badge>
              <p className="mt-1 text-lg text-gray-900">{session.user.email}</p>
            </div>
            <div>
              <Badge variant="outline">Account Type</Badge>
              <p className="mt-1 text-lg text-gray-900">
                {session.user.image
                  ? "OAuth Account (Google/GitHub)"
                  : "Email Account"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* App Features */}
        <Card>
          <CardHeader>
            <CardTitle>✨ App Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <Badge className="mt-2" variant="secondary" />
                <div>
                  <h4 className="font-medium text-gray-900">Precise Timer</h4>
                  <p className="text-sm text-gray-600">
                    Track work sessions with hours, minutes, and seconds
                    precision
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Badge className="mt-2" variant="secondary" />
                <div>
                  <h4 className="font-medium text-gray-900">Smart Rollover</h4>
                  <p className="text-sm text-gray-600">
                    Unfinished tasks automatically move to the next day
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Badge className="mt-2" variant="secondary" />
                <div>
                  <h4 className="font-medium text-gray-900">
                    Daily & Weekly Views
                  </h4>
                  <p className="text-sm text-gray-600">
                    Organize and visualize your tasks across different time
                    periods
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Badge className="mt-2" variant="secondary" />
                <div>
                  <h4 className="font-medium text-gray-900">
                    Progress Analytics
                  </h4>
                  <p className="text-sm text-gray-600">
                    Track your productivity with detailed statistics
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Badge className="mt-2" variant="secondary" />
                <div>
                  <h4 className="font-medium text-gray-900">Task Tagging</h4>
                  <p className="text-sm text-gray-600">
                    Organize tasks with custom tags and categories
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Badge className="mt-2" variant="secondary" />
                <div>
                  <h4 className="font-medium text-gray-900">
                    Work Session Logging
                  </h4>
                  <p className="text-sm text-gray-600">
                    Automatic recording of all your focused work time
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle>💡 Productivity Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-blue-800">
              <p>
                • Set realistic time estimates for your tasks to improve
                planning
              </p>
              <p>
                • Use the timer for focused work sessions to track actual time
                spent
              </p>
              <p>
                • Review your weekly stats to identify productivity patterns
              </p>
              <p>• Tag tasks by project or priority for better organization</p>
              <p>
                • Let the rollover system handle incomplete tasks automatically
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
