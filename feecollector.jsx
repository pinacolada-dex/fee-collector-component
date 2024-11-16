import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

const calculateCollectionCost = (collections, initialCost, minCost, decayFactor) => {
  const collectionsFloat = collections;
  const decay = Math.exp(-decayFactor * collectionsFloat);
  const variablePortion = initialCost - minCost;
  return Math.round(variablePortion * decay + minCost);
};

const CostDecayVisualization = () => {
  const [decayFactor, setDecayFactor] = useState(0.1);
  const [minCost, setMinCost] = useState(100);
  const initialCost = 20000;
  
  // Generate data points
  const generateData = () => {
    const data = [];
    for (let i = 0; i <= 50; i++) {
      data.push({
        collections: i,
        cost: calculateCollectionCost(i, initialCost, minCost, decayFactor)
      });
    }
    return data;
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Fee Collection Cost Decay</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Decay Factor (slower → faster decay): {decayFactor.toFixed(3)}</Label>
              <Slider
                value={[decayFactor]}
                onValueChange={(value) => setDecayFactor(value[0])}
                min={0.01}
                max={0.3}
                step={0.01}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Minimum Cost (tokens): {minCost}</Label>
              <Slider
                value={[minCost]}
                onValueChange={(value) => setMinCost(value[0])}
                min={50}
                max={1000}
                step={50}
              />
            </div>
          </div>

          <div className="h-96">
            <LineChart
              width={800}
              height={400}
              data={generateData()}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="collections" 
                label={{ 
                  value: 'Number of Collections', 
                  position: 'insideBottom', 
                  offset: -5 
                }}
              />
              <YAxis 
                label={{ 
                  value: 'Collection Cost (tokens)', 
                  angle: -90, 
                  position: 'insideLeft'
                }}
              />
              <Tooltip 
                formatter={(value) => [`${value} tokens`, 'Cost']}
                labelFormatter={(value) => `Collection #${value}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="cost"
                stroke="#2563eb"
                name="Collection Cost"
                strokeWidth={2}
              />
            </LineChart>
          </div>

          <div className="space-y-2 text-sm">
            <p>Current Parameters:</p>
            <ul className="list-disc pl-5">
              <li>Initial Cost: {initialCost} tokens</li>
              <li>Minimum Cost: {minCost} tokens</li>
              <li>Decay Factor: {decayFactor}</li>
            </ul>
            <p className="mt-2">
              The curve shows how the collection cost decreases over time, approaching (but never reaching) 
              the minimum cost. A higher decay factor makes the cost decrease more quickly, while a lower 
              decay factor makes it decrease more slowly.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CostDecayVisualization
