import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Calendar, CheckCircle2, Clock, Sparkles } from "lucide-react";
import { toBsDisplay } from "@/lib/bs-date";

export default async function DrawsPage() {
  const userId = await getCurrentUserId();

  const [draws, totalWinnersCount, userCouponsCount] = await Promise.all([
    prisma.draw.findMany({
      include: {
        winners: {
          take: 10,
        },
        _count: {
          select: { coupons: { where: { userId } }, winners: true },
        },
      },
      orderBy: { publishedAt: "desc" },
    }),
    prisma.winner.count(),
    prisma.coupon.count({ where: { userId } }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4 border-b border-[#E2DED2] pb-5">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-[#16181F]">
            IRD Prize Draws
          </h1>
          <p className="text-[#565B66] text-xs sm:text-sm mt-1">
            Official Nepal Inland Revenue Department (IRD) lottery draw publications and winning lists.
          </p>
        </div>
      </div>

      {/* Stats Header */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-white">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-[#E4EAF1] rounded-lg text-[#1E3A5F]">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-[#565B66]">Total Draws</p>
              <p className="text-xl font-bold font-display text-[#16181F]">{draws.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-[#F3E9D2] rounded-lg text-[#B08A28]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-[#565B66]">Official Winners</p>
              <p className="text-xl font-bold font-display text-[#16181F]">{totalWinnersCount}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-[#F4E2DE] rounded-lg text-[#A8241E]">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-[#565B66]">Your Enrolled Coupons</p>
              <p className="text-xl font-bold font-display text-[#16181F]">{userCouponsCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Draws List */}
      <div className="space-y-4">
        {draws.length === 0 ? (
          <Card className="bg-white text-center py-12 px-6">
            <CardContent className="space-y-3">
              <Calendar className="w-10 h-10 mx-auto text-[#8A8E99]" />
              <CardTitle className="text-base">No IRD Draws Published Yet</CardTitle>
              <CardDescription>
                Draws will automatically appear here as soon as published by IRD Nepal.
              </CardDescription>
            </CardContent>
          </Card>
        ) : (
          draws.map((draw) => {
            const isPublished = draw.publishedAt <= new Date();
            const fromBs = toBsDisplay(draw.eligibleFrom);
            const toBs = toBsDisplay(draw.eligibleTo);

            return (
              <Card key={draw.id} className="bg-white hover:border-[#8C8F99] transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{draw.titleEn}</CardTitle>
                        {draw.titleNe && (
                          <span className="text-xs font-mono text-[#565B66]">({draw.titleNe})</span>
                        )}
                      </div>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Eligible Purchase Range:</span>
                        <span className="font-mono font-medium text-[#16181F]">
                          {formatShortDate(draw.eligibleFrom)} ({fromBs} BS) – {formatShortDate(draw.eligibleTo)} ({toBs} BS)
                        </span>
                      </CardDescription>
                    </div>

                    <Badge variant={isPublished ? "winner" : "pending"}>
                      {isPublished ? "PUBLISHED" : "WAITING FOR RESULT"}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="pt-2 border-t border-[#E2DED2] flex items-center justify-between flex-wrap gap-4 text-xs font-mono text-[#565B66]">
                  <div className="flex items-center gap-4 flex-wrap">
                    <span>
                      Total Winners: <strong className="text-[#16181F]">{draw._count.winners}</strong>
                    </span>
                    <span>
                      Your Coupons in this Draw: <strong className="text-[#A8241E]">{draw._count.coupons}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-[#8A8E99]" />
                    <span>Claim Deadline: {formatShortDate(draw.claimDeadline)}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}

function formatShortDate(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
