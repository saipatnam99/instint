'use client'
import React from 'react';
import { useRouter } from 'next/navigation';
import {  MdHelpOutline} from "react-icons/md";
import { RiDashboard3Line , RiBookReadFill, RiSettingsLine} from "react-icons/ri";
import { AiOutlinePieChart } from "react-icons/ai";
import { LuBookMarked } from "react-icons/lu";
import { BiSolidLeaf } from "react-icons/bi";

const menuItems = [
  { name: 'Dashboard', icon:<RiDashboard3Line />, path: '/dashboard' },
  { name: 'Students', icon: <RiBookReadFill />, path: '/students', active: true },
  { name: 'Chapter', icon: <LuBookMarked />, path: '/chapter' },
  { name: 'Help', icon: <MdHelpOutline />, path: '/help' },
  { name: 'Reports', icon: <AiOutlinePieChart />, path: '/reports' },
  { name: 'Settings', icon: <RiSettingsLine />, path: '/settings' },
];


const Sidebar = () => {
  const router = useRouter();

  return (
    <div className="w-[248px] h-screen bg-white border-r border-gray-200">
      {/* Logo Section */}
      <div className="flex items-center px-4 py-2 bg-white rounded-lg">
      <BiSolidLeaf className="text-black text-3xl" />
      <span className="text-lg font-bold text-black">Quyl.</span>
    </div>
      {/* <div className="p-6 flex items-center space-x-2">
        <span className="text-2xl font-bold text-black">Quyl.</span>
      </div> */}

      {/* Menu Items */}
      <nav className="mt-4">
        <ul>
          {menuItems.map((item) => (
            <li key={item.name} className="mb-2">
              <button
                onClick={() => router.push(item.path)}
                className={`flex items-center p-3 w-full text-left text-gray-600 hover:bg-gray-100 hover:text-black ${
                  item.active
                    ? 'bg-gray-100 font-semibold text-black rounded-md'
                    : ''
                }`}
              >
                {/* Icon */}
                <span className="mr-3 text-lg">{item.icon}</span>
                {/* Menu Name */}
                <span>{item.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
