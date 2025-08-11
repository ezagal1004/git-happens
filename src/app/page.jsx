'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Terminal, GitBranch, Code, AlertTriangle, ChevronDown, Github, Coffee, Zap, X } from 'lucide-react';

export default function LandingPage() {
    const [showWarning, setShowWarning] = useState(true);
    const [isStarting, setIsStarting] = useState(false);

    const handleStartTutorial = () => {
        setIsStarting(true);
        // The Link component will handle the navigation
    };

    const dismissWarning = () => {
        setShowWarning(false);
    };

    return (
        <div className="min-h-screen bg-background overflow-x-hidden">
            {/* Content Warning Modal - Blurs background */}
            {showWarning && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[9999] flex items-center justify-center p-3 sm:p-4 overflow-hidden">
                    <div
                        className="bg-background border-2 border-destructive rounded-xl p-4 sm:p-6 max-w-lg w-full mx-2 sm:mx-4 shadow-2xl min-w-0 max-h-[90vh] overflow-y-auto overscroll-contain animate-in fade-in duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-4 gap-3 min-w-0">
                            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                                <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-destructive flex-shrink-0 animate-pulse" />
                                <h3 className="text-lg sm:text-xl font-bold text-destructive break-words">⚠️ ADULT CONTENT WARNING ⚠️</h3>
                            </div>
                            <button
                                onClick={dismissWarning}
                                className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-accent rounded-md flex-shrink-0 touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
                                aria-label="Close warning"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4 text-sm sm:text-base">
                            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                                <p className="font-semibold text-destructive mb-2">This Git tutorial contains:</p>
                                <ul className="list-disc list-inside space-y-1 text-muted-foreground break-words">
                                    <li>Excessive profanity and adult language</li>
                                    <li>Dark humor about software development hell</li>
                                    <li>Brutal honesty about developer incompetence</li>
                                    <li>Existential dread disguised as Git education</li>
                                    <li>Corporate dysfunction and workplace despair</li>
                                </ul>
                            </div>

                            <p className="text-destructive font-bold text-center text-base sm:text-lg break-words">
                                🔞 STRICTLY 18+ ONLY 🔞
                            </p>

                            <p className="text-muted-foreground text-sm break-words overflow-wrap-anywhere">
                                By continuing, you acknowledge that you're an adult who can handle profanity-laden
                                educational content about Git and the reality of software development.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 mt-6">
                            <button
                                onClick={dismissWarning}
                                className="flex-1 px-4 py-3 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-lg transition-colors font-bold text-sm sm:text-base touch-manipulation min-h-[44px]"
                            >
                                I'm 18+, Let's Go
                            </button>

                        </div>
                    </div>
                </div>
            )}

            {/* Main Content - Blurred when warning is showing */}
            <div className={`transition-all duration-300 ${showWarning ? 'blur-sm pointer-events-none' : 'blur-none'}`}>

                {/* Hero Section */}
                <div className="relative min-h-screen overflow-hidden flex flex-col">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5"></div>
                    <div className="relative z-10 flex flex-col min-h-screen">
                        {/* Navigation */}
                        <nav className="p-4 sm:p-6 flex-shrink-0">
                            <div className="container mx-auto max-w-6xl flex items-center justify-between min-w-0">
                                <div className="flex items-center gap-2 min-w-0">
                                    <Terminal className="w-6 h-6 sm:w-8 sm:h-8 text-primary flex-shrink-0" />
                                    <span className="text-lg sm:text-xl font-bold truncate">Git Happens: Adult Swim Edition</span>
                                </div>
                                <div className="flex items-center gap-3 sm:gap-4 text-sm flex-shrink-0">
                                    <a href="#features" className="hover:text-primary transition-colors hidden sm:inline">Why It's Better</a>
                                    <a href="#testimonials" className="hover:text-primary transition-colors hidden sm:inline">Testimonials</a>
                                    <a
                                        href="https://github.com/ezagal1004"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-primary transition-colors touch-manipulation"
                                        aria-label="GitHub Profile"
                                    >
                                        <Github className="w-4 h-4 sm:w-5 sm:h-5 hover:text-primary transition-colors cursor-pointer touch-manipulation" />
                                    </a>
                                </div>
                            </div>
                        </nav>

                        {/* Main Hero - Centered Content */}
                        <div className="flex-1 flex items-center justify-center px-4 sm:px-6">
                            <div className="container mx-auto max-w-6xl">
                                <div className="text-center space-y-6 sm:space-y-8">
                                    <div className="space-y-3 sm:space-y-4">
                                        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold leading-tight break-words">
                                            Learn Git Without<br />
                                            <span className="text-primary">Losing Your Fucking Mind</span>
                                        </h1>
                                        <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto break-words overflow-wrap-anywhere">
                                            The brutally honest Git tutorial for developers who are tired of corporate bullshit explanations
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap justify-center gap-2 sm:gap-4 text-xs sm:text-sm">
                                        <div className="flex items-center gap-1 sm:gap-2 bg-accent/50 px-2 sm:px-3 py-1 sm:py-2 rounded-full border border-border">
                                            <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
                                            <span className="whitespace-nowrap">No Bullshit</span>
                                        </div>
                                        <div className="flex items-center gap-1 sm:gap-2 bg-accent/50 px-2 sm:px-3 py-1 sm:py-2 rounded-full border border-border">
                                            <Coffee className="w-3 h-3 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
                                            <span className="whitespace-nowrap">Profanity-Powered</span>
                                        </div>
                                        <div className="flex items-center gap-1 sm:gap-2 bg-accent/50 px-2 sm:px-3 py-1 sm:py-2 rounded-full border border-border">
                                            <Code className="w-3 h-3 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
                                            <span className="whitespace-nowrap">Actually Useful</span>
                                        </div>
                                    </div>

                                    <Link href="/start" onClick={handleStartTutorial}>
                                        <button
                                            disabled={isStarting}
                                            className="group inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-primary text-primary-foreground text-sm sm:text-base font-medium rounded-lg hover:bg-primary/90 transition-all border border-primary/20 shadow-sm touch-manipulation min-h-[44px]"
                                        >
                                            {isStarting ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
                                                    <span className="break-words">Starting This Shit...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="break-words">Start Learning Git</span>
                                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
                                                </>
                                            )}
                                        </button>
                                    </Link>

                                    <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto break-words overflow-wrap-anywhere mt-6">
                                        Warning: Side effects include understanding Git workflows, using proper commit messages,
                                        and not getting fired on your first day. May cause sudden competence in version control.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Scroll indicator - Positioned at bottom */}
                        <div className="flex-shrink-0 pb-6 sm:pb-8 flex justify-center">
                            <div className="animate-bounce">
                                <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div id="features" className="py-12 sm:py-20 bg-muted/30">
                    <div className="container mx-auto max-w-6xl px-4 sm:px-6">
                        <div className="text-center mb-12 sm:mb-16">
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 break-words">
                                Why This Tutorial Doesn't Suck Ass
                            </h2>
                            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto break-words overflow-wrap-anywhere">
                                Unlike other tutorials that treat you like an idiot, we acknowledge that Git is confusing as hell and explain it properly
                            </p>
                        </div>

                        <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
                            <div className="bg-card border border-border rounded-lg p-4 sm:p-6 hover:border-primary/50 transition-colors shadow-sm min-w-0">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3 sm:mb-4 flex-shrink-0">
                                    <Terminal className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                                </div>
                                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 break-words">Interactive Terminal</h3>
                                <p className="text-sm sm:text-base text-muted-foreground break-words overflow-wrap-anywhere">
                                    Learn by fucking up in a safe environment. Make mistakes, see what breaks,
                                    and understand why Git hates you - just like in real development hell.
                                </p>
                            </div>

                            <div className="bg-card border border-border rounded-lg p-4 sm:p-6 hover:border-primary/50 transition-colors shadow-sm min-w-0">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3 sm:mb-4 flex-shrink-0">
                                    <GitBranch className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                                </div>
                                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 break-words">Branching Explained Right</h3>
                                <p className="text-sm sm:text-base text-muted-foreground break-words overflow-wrap-anywhere">
                                    We explain Git branches as parallel universes where you can break shit without
                                    destroying everyone else's work. Because that's exactly what they fucking are.
                                </p>
                            </div>

                            <div className="bg-card border border-border rounded-lg p-4 sm:p-6 hover:border-primary/50 transition-colors shadow-sm min-w-0">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3 sm:mb-4 flex-shrink-0">
                                    <Code className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                                </div>
                                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 break-words">Real Corporate Dysfunction</h3>
                                <p className="text-sm sm:text-base text-muted-foreground break-words overflow-wrap-anywhere">
                                    Learn Git through scenarios of workplace incompetence and developer despair.
                                    Because that's the environment where you'll actually be using this shit.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Testimonials Section */}
                <div id="testimonials" className="py-12 sm:py-20">
                    <div className="container mx-auto max-w-4xl px-4 sm:px-6">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-12 sm:mb-16 break-words">
                            What <span className="text-gray-400 opacity-50">I Want</span> Developers <span className="text-gray-400 opacity-50">to</span> Actually Say
                        </h2>

                        <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
                            <div className="bg-card border border-border rounded-lg p-4 sm:p-6 shadow-sm min-w-0">
                                <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4 break-words overflow-wrap-anywhere">
                                    "Holy shit, finally a Git tutorial that doesn't make me want to throw my laptop out the window.
                                    The profanity actually helped me remember the commands better."
                                </p>
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="font-semibold text-xs sm:text-sm text-primary-foreground">JS</span>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-semibold text-sm sm:text-base truncate">Jamie S.</p>
                                        <p className="text-xs sm:text-sm text-muted-foreground truncate">Junior Dev (Formerly Clueless)</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-card border border-border rounded-lg p-4 sm:p-6 shadow-sm min-w-0">
                                <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4 break-words overflow-wrap-anywhere">
                                    "This tutorial saved my ass and my job. I went from being terrified of Git to actually understanding
                                    what the fuck I was doing. The humor made it bearable."
                                </p>
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="font-semibold text-xs sm:text-sm text-primary-foreground">AT</span>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-semibold text-sm sm:text-base truncate">Alex T.</p>
                                        <p className="text-xs sm:text-sm text-muted-foreground truncate">Bootcamp Survivor</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-card border border-border rounded-lg p-4 sm:p-6 shadow-sm min-w-0">
                                <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4 break-words overflow-wrap-anywhere">
                                    "I've been coding for 3 years and still didn't understand Git. This tutorial explained it in a way
                                    that finally clicked. Plus it's fucking hilarious."
                                </p>
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="font-semibold text-xs sm:text-sm text-primary-foreground">MK</span>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-semibold text-sm sm:text-base truncate">Morgan K.</p>
                                        <p className="text-xs sm:text-sm text-muted-foreground truncate">Self-Taught Developer</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-card border border-border rounded-lg p-4 sm:p-6 shadow-sm min-w-0">
                                <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4 break-words overflow-wrap-anywhere">
                                    "Best Git tutorial I've ever seen. No corporate bullshit, just straight talk about how this shit
                                    actually works. My team lead was impressed with my Git skills after this."
                                </p>
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="font-semibold text-xs sm:text-sm text-primary-foreground">DR</span>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-semibold text-sm sm:text-base truncate">Danny R.</p>
                                        <p className="text-xs sm:text-sm text-muted-foreground truncate">Career Changer</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="py-12 sm:py-20 bg-muted/30">
                    <div className="container mx-auto max-w-4xl px-4 sm:px-6 text-center">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 break-words">
                            Ready to Stop Being Git-Incompetent?
                        </h2>
                        <p className="text-lg sm:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto break-words overflow-wrap-anywhere">
                            Join thousands of developers who've learned Git without having a complete mental breakdown.
                            Your future self will thank you, and your teammates will stop fucking hating you.
                        </p>

                        <div className="space-y-3 sm:space-y-4">
                            <Link href="/start" onClick={handleStartTutorial}>
                                <button
                                    disabled={isStarting}
                                    className="group inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-primary text-primary-foreground text-sm sm:text-base font-medium rounded-lg hover:bg-primary/90 transition-all border border-primary/20 shadow-sm touch-manipulation min-h-[44px]"
                                >
                                    {isStarting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
                                            <span className="break-words">Loading This Shit...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="break-words">Start Learning Git Now</span>
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
                                        </>
                                    )}
                                </button>
                            </Link>

                            <p className="text-xs sm:text-sm text-muted-foreground break-words">
                                Free • No signup bullshit • Just pure, unfiltered Git education
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="py-8 sm:py-12 border-t border-border">
                    <div className="container mx-auto max-w-6xl px-4 sm:px-6">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 min-w-0">
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <Terminal className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                                <span className="font-semibold text-sm sm:text-base">Git Happens</span>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 text-xs sm:text-sm text-muted-foreground min-w-0">
                                <span className="break-words text-center">Made with questionable life choices</span>
                                <span className="hidden sm:inline">•</span>
                                <span className="break-words text-center">Powered by coffee, rage, and developer tears</span>
                            </div>

                            <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
                                <a
                                    href="https://github.com/ezagal1004"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-primary transition-colors touch-manipulation"
                                    aria-label="GitHub Profile"
                                >
                                    <Github className="w-4 h-4 sm:w-5 sm:h-5" />
                                </a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}