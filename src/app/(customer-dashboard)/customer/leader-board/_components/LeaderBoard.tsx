'use client'

import React from 'react'

import { FaGift, FaStar, FaTrophy } from 'react-icons/fa'
import { MdQrCode, MdAddCircle, MdCheckCircle } from 'react-icons/md'

const LeaderBoard = () => {
  return (
    <div className="max-w-3xl mx-auto bg-white text-black p-6 rounded-lg shadow-lg space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-red-600 p-6 rounded-md">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FaTrophy className="text-yellow-400" /> Membership Level
          </h2>
          <span className="text-right">Total Points <strong>1250</strong></span>
        </div>
        <div className="text-xl font-bold text-silver mb-2">🥈 Silver</div>
        <div className="w-full bg-gray-200 h-2 rounded-full mb-2">
          <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '17%' }}></div>
        </div>
        <div className="text-sm mb-4">1250 more points needed for Gold status</div>
        <button className="w-full py-2 rounded bg-orange-500 text-black font-semibold flex justify-center items-center gap-2">
          <MdQrCode /> Show Membership QR Code
        </button>
      </div>

      {/* Available Rewards */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Available Rewards</h3>
        <div className="grid grid-cols-2 gap-3">
          {[{ name: 'Free Game Session', points: 500 }, { name: '25% Off Snack Bar', points: 300 }, { name: 'VR Experience', points: 1000 }, { name: 'Bring a Friend Free', points: 800 }].map((reward, idx) => (
            <div key={idx} className="bg-gray-200 p-4 rounded flex justify-between items-center">
              <div>
                <p className="font-medium flex items-center gap-2"><FaGift /> {reward.name}</p>
                <span className="text-sm text-gray-400">{reward.points} points</span>
              </div>
              <button className="bg-yellow-400 text-black font-bold px-3 py-1 rounded">Redeem</button>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Recent Activity</h3>
        <div className="space-y-2">
          {[{ title: 'Game Session', date: 'Today', pts: 50 }, { title: 'Purchase Bonus', date: 'Yesterday', pts: 75 }, { title: 'Monthly Bonus', date: '3 days ago', pts: 100 }, { title: 'Redeemed Reward', date: '1 week ago', pts: -300 }].map((activity, idx) => (
            <div key={idx} className="bg-gray-200 px-4 py-2 rounded flex justify-between">
              <div>
                <p className="font-medium">{activity.title}</p>
                <span className="text-xs text-gray-400">{activity.date}</span>
              </div>
              <span className={`font-bold ${activity.pts < 0 ? 'text-red-400' : 'text-green-400'}`}>{activity.pts > 0 ? '+' : ''}{activity.pts} pts</span>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <div>
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <FaStar className="text-blue-400" /> Silver Membership Benefits
        </h3>
        <div className="bg-gray-200 p-4 rounded space-y-2">
          <div className="flex items-center gap-2">
            <MdCheckCircle className="text-green-400" /> 10% discount on all purchases
          </div>
          <div className="flex items-center gap-2">
            <MdAddCircle className="text-green-400" /> Priority access to new games
          </div>
        </div>
      </div>
    </div>
  )
}

export default LeaderBoard
