import React from 'react';
import { AlignLeft, Home, TrendingUp, BookOpen } from 'lucide-react';

export const Guidebook = () => (
    <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {[
            { icon: <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-blue-400" />, title: "Hues (Color Domains)", subtitle: "What is a Hue?", text: "A Hue is one area of your life that carries feeling (like Body, Joy, Grief, or Politics). Each color helps you check in with that part of your world." },
            { icon: <AlignLeft className="w-6 h-6 text-stone-600" />, title: "Vividness Scale", subtitle: "What is the Vividness Scale?", text: "This scale lets you choose how present a Hue feels today, from Faint to Vivid. It is about noticing intensity, not judging yourself. Slide to the level that feels closest to your experience right now, then let that be enough." },
            { icon: <Home className="w-6 h-6 text-stone-600" />, title: "Home Screen", subtitle: "What is the Home screen?", text: "This is your starting place, where you can see your Hues and choose one to check in with today. Tap a color or a Hue name when you are ready to notice how that part of your life feels." },
            { icon: <TrendingUp className="w-6 h-6 text-emerald-500" />, title: "Spectrum Page", subtitle: "What is the Spectrum page?", text: "The Spectrum page shows gentle patterns in your Hues over time, like which colors have been quiet or loud lately. Choose a Hue to see how its vividness has shifted. Use this as a way to understand your seasons, not as a grade or goal." },
            { icon: <BookOpen className="w-6 h-6 text-amber-600" />, title: "Library", subtitle: "What is the Library?", text: "The Library gathers your past check ins, notes, and voice reflections in one place, like a private archive of your inner weather. Visit when you want to remember what was happening around strong days, quiet days, or important shifts." },
            { icon: <AlignLeft className="w-6 h-6 text-stone-400" />, title: "Notes", subtitle: "What are Notes?", text: "Notes let you put a few words around why a Hue feels the way it does today. Write as much or as little as you like, a single sentence is enough to give future you some context." },
        ].map((item, i) => (
            <section key={i} className="bg-white/80 wet-paint rounded-[2.5rem] p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                    {item.icon}
                    <h3 className="font-bold text-lg text-stone-800">{item.title}</h3>
                </div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">{item.subtitle}</h4>
                <p className="text-stone-600 leading-relaxed text-sm">{item.text}</p>
            </section>
        ))}
    </div>
);

export default Guidebook;