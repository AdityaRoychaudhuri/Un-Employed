"use client";

import { Brain, Briefcase, LineChart, TrendingDown, TrendingUp, Trophy } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns'
import React from 'react'
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardTitle, CardHeader, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import TopSkillCard from './TopSkillCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DashboardView = ({ insights }) => {
  const salaryData = insights.salaryRange.map((item) => ({
    name: item.role,
    min: item.min / 1000,
    max: item.max / 1000,
    median: item.median / 1000,
  }));

  const demandDataColor = (level) => {
    switch (level.toLowerCase()){
      case "high":
        return "bg-green-500";
      case "low":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const marketCondColor = (cond) => {
    switch (cond.toLowerCase()) {
      case "positive":
        return { icon: TrendingUp, color: "text-green-500" };
      case "negative":
        return { icon: TrendingDown, color: "text-red-500" };
      case "neutral":
        return { icon: LineChart, color: "text-yellow-500" };
      default:
        return { icon: LineChart, color: "text-gray-500" };
    }
  };

  const CondIcon = marketCondColor(insights.marketCond).icon;
  const condColor = marketCondColor(insights.marketCond).color;

  const lastUpdated = format(new Date(insights.lastUpdated), "dd/MM/yyyy")
  const nextUpdate = formatDistanceToNow(new Date(insights.nextUpdate), {addSuffix: true})

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <Badge variant="secondary">Last Update: {lastUpdated}</Badge>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch'>
        <Card className='h-full flex flex-col'>
          <CardHeader className="flex items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Market Outlook</CardTitle>
            <CondIcon className={`size-4 ${condColor}`}/>
          </CardHeader>
          <CardContent className='flex flex-1 flex-col justify-around'>
            <div className='text-2xl font-bold'>{insights.marketCond}</div>
            <p className='text-xs text-muted-foreground'>Next update: {nextUpdate}</p>
          </CardContent>
        </Card>

        <Card className='h-full flex flex-col'>
          <CardHeader className="flex items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Industry Growth</CardTitle>
            <TrendingUp className='size-4 text-muted-foreground'/>
          </CardHeader>
          <CardContent className='flex flex-1 flex-col justify-around'>
            <div className='text-2xl font-bold'>{insights.growthRate.toFixed(1)}%</div>
            <Progress value={insights.growthRate} className="mt-2"/>
          </CardContent>
        </Card>

        <Card className='h-full flex flex-col'>
          <CardHeader className="flex items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Demand Level</CardTitle>
            <Briefcase className='size-4 text-muted-foreground'/>
          </CardHeader>
          <CardContent className='flex flex-1 flex-col justify-around'>
            <div className='text-2xl font-bold'>{insights.demandLevel}</div>
            <div className={`h-2 w-full rounded-full mt-2 ${demandDataColor(insights.demandLevel)}`}/>
          </CardContent>
        </Card>
        
        <Card className='h-full'>
          <CardHeader className="flex items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Top Skills</CardTitle>
            <Brain className='size-4 text-muted-foreground'/>
          </CardHeader>
          <CardContent className="max-h-28 overflow-y-auto no-scrollbar">
            <TopSkillCard insights={insights}/>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Skills</CardTitle>
          <CardDescription>
            Displaying minimum, median and maximum salaries (in thousands)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='h-[424px]'>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
              data={salaryData}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis width="auto" />
              <Tooltip content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className='bg-background border rounded-lg p-2 shadow-md'>
                      <p className='font-medium mb-2'>{label}</p>
                      {payload.map((item) => (
                        <p key={item.name} className='text-sm mb-1'>
                          {item.name} : ${item.value}K
                        </p>
                      ))}
                    </div>
                  )
                }

                return null;
                }}/>
                <Legend />
                <Bar dataKey="min" fill='#94a3b8' name="Min salary (K)"/>
                <Bar dataKey="median" fill='#64748b' name="Median salary (K)"/>
                <Bar dataKey="max" fill='#475569' name="Max salary (K)"/>

              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <Card>
        <CardHeader>
          <CardTitle>Key Industry Trends</CardTitle>
          <CardDescription>
            Current trends shaping the industry
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className='space-y-4'>
            {insights.keyOutlook.map((trend, id) => (
              <li key={id} className='flex flex-start space-x-2'>
                <div className='size-1.5 mt-2 rounded-full bg-primary'/>
                <span className='text-sm'>{trend}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recommended Skills</CardTitle>
            <CardDescription>
              Skills to develop while developing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex flex-wrap gap-1'>
              {insights.recommendedSkills.map((skill) => (
                <Badge key={skill} variant='secondary' className='py-2 px-2 font-semibold text-sm'>
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default DashboardView