/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  User,
  ChevronDown,
  ExternalLink,
  Bookmark,
  Share2,
  Download,
  FileText,
  Database,
  BookOpen,
  Microscope,
  Code,
  Activity,
  HelpCircle,
  ArrowRight,
  X,
  Globe,
  SlidersHorizontal,
  Check,
  Filter,
  Info,
  Menu,
  Layers,
  Cpu,
  Sparkles,
  Play,
  Upload,
  Terminal,
  BookMarked,
  ShieldCheck,
  Loader2,
  Sun,
  Moon,
  MessageSquare,
  Send,
  Home,
  Wrench,
  FolderDown,
  Zap,
  CheckCircle2,
  Copy
} from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  category: 'Literature' | 'Genes' | 'Proteins' | 'Genomes' | 'Clinical' | 'PubChem';
  authors: string;
  journal: string;
  year: string;
  pmid?: string;
  snippet: string;
  accession?: string;
  organism?: string;
  fullAbstract?: string;
}

const SEARCH_SUGGESTIONS: string[] = [
  'DNA double helix structure and chromatin',
  'BRCA1 gene mutation in breast cancer',
  'DNA polymerase alpha catalytic subunit',
  'Escherichia coli K-12 complete genome',
  'Cell-free DNA in early cancer detection',
  'CRISPR-Cas9 gene editing mechanisms',
  'TP53 tumor suppressor protein pathways'
];

const MOCK_RESULTS: SearchResult[] = [
  {
    id: '1',
    title: 'Structure and function of DNA double helix in eukaryotic chromatin organization',
    category: 'Literature',
    authors: 'Smith JA, Doe RM, Chen L, et al.',
    journal: 'Nature Structural & Molecular Biology',
    year: '2025',
    pmid: 'PMID: 38912450',
    snippet: 'The genomic DNA double helix undergoes dynamic conformational transitions regulated by histone modifications and epigenetic factors. Here we review recent advances in high-resolution cryo-EM imaging of DNA-protein complexes...',
    fullAbstract: 'The genomic DNA double helix undergoes dynamic conformational transitions regulated by histone modifications and epigenetic factors. Here we review recent advances in high-resolution cryo-EM imaging of DNA-protein complexes, detailing how nucleosome remodeling complexes alter local DNA topology to facilitate transcriptional activation and DNA repair.'
  },
  {
    id: '2',
    title: 'BRCA1 DNA repair associated [Homo sapiens (human)]',
    category: 'Genes',
    authors: 'NCBI Gene ID: 672',
    journal: 'Updated on 05-OCT-2026',
    year: '2026',
    accession: 'NC_000017.11',
    organism: 'Homo sapiens',
    snippet: 'This gene encodes a nuclear phosphoprotein that plays a role in maintaining genomic stability and acts as a tumor suppressor. It combines with other tumor suppressors, DNA damage sensors, and signal transducers...',
    fullAbstract: 'This gene encodes a nuclear phosphoprotein that plays a role in maintaining genomic stability and acts as a tumor suppressor. It combines with other tumor suppressors, DNA damage sensors, and signal transducers to form a large multi-subunit protein complex known as the BASC.'
  }
];

export default function App() {
  // Client-side routing: initialize view from URL path
  const getInitialView = (): 'home' | 'search' | 'detail' | 'submission' | 'all_resources' | 'download' | 'learn' | 'analyze' | 'develop' | 'research' => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path === '/download') return 'download';
      if (path === '/submission') return 'submission';
      if (path === '/all_resources') return 'all_resources';
      if (path === '/learn') return 'learn';
      if (path === '/analyze') return 'analyze';
      if (path === '/develop') return 'develop';
      if (path === '/research') return 'research';
    }
    return 'home';
  };

  const [view, setView] = useState<'home' | 'search' | 'detail' | 'submission' | 'all_resources' | 'download' | 'learn' | 'analyze' | 'develop' | 'research'>(getInitialView);
  const [searchQuery, setSearchQuery] = useState('DNA');
  const [downloadSearchQuery, setDownloadSearchQuery] = useState('');
  const [learnSearchQuery, setLearnSearchQuery] = useState('');
  const [selectedDatabase, setSelectedDatabase] = useState('All Databases');
  const [activeTab, setActiveTab] = useState<'All' | 'Literature' | 'Genes' | 'Proteins' | 'Genomes' | 'Clinical' | 'PubChem' | 'BLAST'>('All');
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [isDbDropdownOpen, setIsDbDropdownOpen] = useState(false);
  const [isPopularResourcesOpen, setIsPopularResourcesOpen] = useState(false);

  // Dark mode state
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Live NCBI Search & BLAST State
  const [searchResults, setSearchResults] = useState<SearchResult[]>(MOCK_RESULTS);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [organismFilter, setOrganismFilter] = useState('');
  const [blastSeqInput, setBlastSeqInput] = useState('');
  const [blastResultData, setBlastResultData] = useState<any>(null);
  const [isBlastRunning, setIsBlastRunning] = useState(false);

  useEffect(() => {
    if (view === 'search') {
      setIsSearchLoading(true);
      fetch(`/api/ncbi-search?query=${encodeURIComponent(searchQuery)}&db=${selectedDatabase}&category=${activeTab}`)
        .then(res => res.json())
        .then(data => {
          if (data.results && data.results.length > 0) {
            setSearchResults(data.results);
          } else {
            setSearchResults(MOCK_RESULTS);
          }
        })
        .catch(err => {
          console.error(err);
          setSearchResults(MOCK_RESULTS);
        })
        .finally(() => setIsSearchLoading(false));
    }
  }, [view, searchQuery, selectedDatabase, activeTab]);

  const runBlast = async () => {
    if (!blastSeqInput.trim()) return;
    setIsBlastRunning(true);
    try {
      const res = await fetch('/api/ncbi-blast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sequence: blastSeqInput })
      });
      const data = await res.json();
      setBlastResultData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsBlastRunning(false);
    }
  };

  // Submission portal state
  const [submitQuery, setSubmitQuery] = useState('');
  const [submitPortalTab, setSubmitPortalTab] = useState<'portal' | 'my_submissions'>('portal');
  const [submitActiveCategory, setSubmitActiveCategory] = useState<'all' | 'sequences' | 'genomes' | 'clinical'>('all');
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardTool, setWizardTool] = useState('SRA');
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardTitle, setWizardTitle] = useState('');
  const [wizardOrganism, setWizardOrganism] = useState('Homo sapiens');
  const [wizardPlatform, setWizardPlatform] = useState('Illumina NovaSeq 6000');
  const [wizardFiles, setWizardFiles] = useState<string[]>(['sample_R1.fastq.gz', 'sample_R2.fastq.gz']);
  const [wizardSubmitterName, setWizardSubmitterName] = useState('Dr. Researcher');
  const [wizardEmail, setWizardEmail] = useState('researcher@nih.gov');
  const [submittedAccession, setSubmittedAccession] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionsList, setSubmissionsList] = useState<Array<{
    id: string;
    tool: string;
    title: string;
    organism: string;
    accession: string;
    status: 'In Review' | 'Processing' | 'Published';
    date: string;
    fileCount: number;
  }>>([
    {
      id: 'SUB14298101',
      tool: 'SRA',
      title: 'Whole genome sequencing of Mycobacterium tuberculosis clinical isolates',
      organism: 'Mycobacterium tuberculosis',
      accession: 'SRR29481940',
      status: 'Published',
      date: '2026-09-18',
      fileCount: 4
    },
    {
      id: 'SUB14389211',
      tool: 'GenBank',
      title: 'Complete chloroplast genome of Arabidopsis thaliana mutant line 4',
      organism: 'Arabidopsis thaliana',
      accession: 'OR983271.1',
      status: 'Processing',
      date: '2026-10-02',
      fileCount: 2
    }
  ]);

  const openWizardForTool = (toolName: string) => {
    setWizardTool(toolName);
    setWizardStep(1);
    setWizardTitle(`${toolName} Dataset Submission - ${new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`);
    setSubmittedAccession(null);
    setIsWizardOpen(true);
  };

  const handleCompleteSubmission = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const randomNum = Math.floor(100000 + Math.random() * 900000);
      let newAcc = `SUB${randomNum}`;
      if (wizardTool === 'SRA') newAcc = `SRR${randomNum}`;
      else if (wizardTool === 'GenBank') newAcc = `OR${randomNum.toString().slice(0, 6)}.1`;
      else if (wizardTool === 'ClinVar') newAcc = `SCV00${randomNum}`;
      else if (wizardTool === 'GEO') newAcc = `GSE${randomNum}`;
      else newAcc = `PRJNA${randomNum}`;

      const newSubmission = {
        id: `SUB${randomNum}`,
        tool: wizardTool,
        title: wizardTitle || `${wizardTool} dataset submission`,
        organism: wizardOrganism,
        accession: newAcc,
        status: 'Processing' as const,
        date: new Date().toISOString().split('T')[0],
        fileCount: wizardFiles.length
      };

      setSubmissionsList(prev => [newSubmission, ...prev]);
      setSubmittedAccession(newAcc);
      setIsSubmitting(false);
      setWizardStep(4);
    }, 600);
  };

  // Download Page Interactivity Modals
  const [downloadModal, setDownloadModal] = useState<'ftp' | 'aspera' | 'tools' | 'custom' | 'practices' | 'sra' | null>(null);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  // Learn Page Interactivity Modals
  const [learnModal, setLearnModal] = useState<'webinars' | 'conferences' | 'tutorials' | 'docs' | null>(null);

  // Portal Modals State for other home page cards
  const [activePortalModal, setActivePortalModal] = useState<'develop' | 'analyze' | 'research' | null>(null);

  // Auto-complete state
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const searchInputRef = useRef<HTMLDivElement>(null);

  // AI Summaries State
  const [aiSummaries, setAiSummaries] = useState<{ [id: string]: string }>({});
  const [aiLoadingId, setAiLoadingId] = useState<string | null>(null);

  // Listen to browser forward/backward buttons for seamless client routing
  useEffect(() => {
    const handlePopState = () => {
      setView(getInitialView());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Internal client-side navigation without full page reload
  const navigateTo = (newView: 'home' | 'search' | 'detail' | 'submission' | 'all_resources' | 'download' | 'learn' | 'analyze' | 'develop' | 'research') => {
    setView(newView);
    const path = newView === 'home' ? '/' : `/${newView}`;
    if (window.location.pathname !== path) {
      window.history.pushState({ view: newView }, '', path);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchInputRef.current && !searchInputRef.current.contains(e.target as Node)) {
        setShowAutocomplete(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const q = customQuery !== undefined ? customQuery : searchQuery;
    if (!q.trim()) return;
    setSearchQuery(q);
    navigateTo('search');
    setActiveTab('All');
    setShowAutocomplete(false);
  };

  const handleSidebarNav = (resourceName: string) => {
    if (resourceName.includes('Submit') || resourceName.includes('Submission')) {
      navigateTo('submission');
    } else if (resourceName.includes('Download')) {
      navigateTo('download');
    } else if (resourceName.includes('Learn')) {
      navigateTo('learn');
    } else if (resourceName.includes('All Resources') || resourceName.includes('Resource List')) {
      navigateTo('all_resources');
    } else {
      setSearchQuery(resourceName);
      navigateTo('search');
      setActiveTab('All');
    }
  };

  const generateAiSummary = async (record: SearchResult) => {
    if (aiSummaries[record.id]) return;
    setAiLoadingId(record.id);
    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: searchQuery,
          recordTitle: record.title,
          snippet: record.snippet
        })
      });
      const data = await res.json();
      if (data.summary) {
        setAiSummaries(prev => ({ ...prev, [record.id]: data.summary }));
      }
    } catch (err) {
      console.error(err);
      setAiSummaries(prev => ({
        ...prev,
        [record.id]: `Key biological significance: This record explores fundamental mechanisms related to ${record.title}. It provides critical baseline data for genomic and biomedical applications.`
      }));
    } finally {
      setAiLoadingId(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(text);
    setTimeout(() => setCopiedCmd(null), 2500);
  };

  const filteredResults = MOCK_RESULTS.filter(res => {
    const matchesQuery = res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         res.snippet.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         res.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'All' || res.category === activeTab;
    return matchesQuery && matchesTab;
  });

  const matchingSuggestions = SEARCH_SUGGESTIONS.filter(s =>
    s.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`min-h-screen font-sans flex flex-col selection:bg-blue-200 transition-colors duration-200 ${
      isDarkMode ? 'bg-slate-900 text-slate-100' : 'bg-[#f0f4f8] text-[#222]'
    }`}>
      {/* =========================================================================
          TOP HEADER (NIH National Library of Medicine branding)
         ========================================================================= */}
      <header className="bg-[#184175] text-white border-b-4 border-[#0f172a] shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigateTo('home')}>
            <div className="bg-white text-[#184175] font-black px-3 py-1.5 rounded text-xl tracking-wider shadow">
              NIH
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight leading-none hover:underline">
                National Library of Medicine
              </h1>
              <p className="text-xs text-blue-200 mt-1 uppercase tracking-wider font-medium">
                National Center for Biotechnology Information
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigateTo('home')}
              className={`text-xs font-bold px-3 py-1.5 rounded transition ${
                view === 'home' ? 'bg-blue-600 text-white shadow' : 'bg-blue-900/60 text-blue-200 hover:text-white'
              }`}
            >
              NCBI Home
            </button>
            <button
              onClick={() => navigateTo('download')}
              className={`text-xs font-bold px-3 py-1.5 rounded transition ${
                view === 'download' ? 'bg-blue-600 text-white shadow' : 'bg-blue-900/60 text-blue-200 hover:text-white'
              }`}
            >
              Download
            </button>
            <button
              onClick={() => navigateTo('submission')}
              className={`text-xs font-bold px-3 py-1.5 rounded transition ${
                view === 'submission' ? 'bg-blue-600 text-white shadow' : 'bg-blue-900/60 text-blue-200 hover:text-white'
              }`}
            >
              Submit Portal
            </button>

            {/* DARK MODE TOGGLE */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              title="Toggle Dark/Light Mode"
              className="p-2 bg-blue-900/80 hover:bg-blue-800 text-blue-200 hover:text-white rounded-lg transition border border-blue-700 flex items-center space-x-1 text-xs font-semibold"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-blue-200" />}
              <span className="hidden sm:inline">{isDarkMode ? 'Light' : 'Dark'}</span>
            </button>

            {isLoggedIn ? (
              <div className="flex items-center space-x-3 bg-blue-900 px-3 py-1.5 rounded-md border border-blue-700">
                <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                  {username ? username[0].toUpperCase() : 'U'}
                </div>
                <span className="text-sm font-medium">{username || 'User'}</span>
                <button
                  onClick={() => { setIsLoggedIn(false); setUsername(''); }}
                  className="text-xs text-blue-300 hover:text-white underline ml-2"
                >
                  Log out
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="bg-white text-[#184175] hover:bg-blue-50 font-semibold px-5 py-1.5 rounded shadow text-sm transition flex items-center space-x-1.5"
              >
                <User className="w-4 h-4" />
                <span>Log in</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* =========================================================================
          VIEW 1: DOWNLOAD PAGE (/download) - REPLICATING ATTACHED SCREENSHOT
         ========================================================================= */}
      {view === 'download' ? (
        <div className="flex-1 flex flex-col">
          {/* TOP NAVIGATION BAR AS SHOWN IN SCREENSHOT */}
          <nav className={`border-b text-xs font-bold tracking-wide shadow-xs ${
            isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-gray-100 border-gray-300 text-gray-800'
          }`}>
            <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center space-x-4 md:space-x-6 overflow-x-auto whitespace-nowrap">
              <button onClick={() => navigateTo('home')} className="hover:text-blue-700 transition uppercase">
                NCBI HOME
              </button>
              <button onClick={() => handleSearchSubmit(undefined, 'Literature')} className="hover:text-blue-700 transition uppercase">
                LITERATURE
              </button>
              <button onClick={() => handleSearchSubmit(undefined, 'Health')} className="hover:text-blue-700 transition uppercase">
                HEALTH
              </button>
              <button onClick={() => handleSearchSubmit(undefined, 'Genomes')} className="hover:text-blue-700 transition uppercase">
                GENOMES
              </button>
              <button onClick={() => handleSearchSubmit(undefined, 'Genes')} className="hover:text-blue-700 transition uppercase">
                GENES
              </button>
              <button onClick={() => handleSearchSubmit(undefined, 'Proteins')} className="hover:text-blue-700 transition uppercase">
                PROTEINS
              </button>
              <button onClick={() => handleSearchSubmit(undefined, 'Chemicals')} className="hover:text-blue-700 transition uppercase">
                CHEMICALS
              </button>
              <button
                onClick={() => navigateTo('submission')}
                className="hover:text-blue-700 transition uppercase font-extrabold text-blue-800 flex items-center space-x-1"
                title="Go to Submission Portal"
              >
                <span>SUBMIT</span>
              </button>

              <div className="relative">
                <button
                  onClick={() => setIsPopularResourcesOpen(!isPopularResourcesOpen)}
                  className="hover:text-blue-700 transition uppercase flex items-center space-x-1 font-bold text-blue-900"
                >
                  <span>POPULAR RESOURCES</span>
                  <span className="text-[10px]">▼</span>
                </button>
                {isPopularResourcesOpen && (
                  <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-300 rounded shadow-xl z-50 text-xs py-1 divide-y divide-gray-100 font-normal">
                    {['PubMed', 'BLAST', 'Nucleotide', 'Genome', 'SNP', 'Gene', 'Protein', 'PubChem'].map(item => (
                      <div
                        key={item}
                        onClick={() => { handleSearchSubmit(undefined, item); setIsPopularResourcesOpen(false); }}
                        className="px-3 py-1.5 hover:bg-blue-50 cursor-pointer text-gray-800"
                      >
                        {item}
                      </div>
                    ))}
                    <div
                      onClick={() => { navigateTo('submission'); setIsPopularResourcesOpen(false); }}
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 cursor-pointer text-blue-800 font-bold flex items-center justify-between"
                    >
                      <span>Submission Portal</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                )}
              </div>

              {/* DIRECT SUBMISSION PORTAL LINK IN NAV BAR (link this page submit button) */}
              <button
                onClick={() => navigateTo('submission')}
                className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-1 rounded text-[11px] font-bold shadow-xs ml-auto transition flex items-center space-x-1"
                title="Go to NCBI Submission Portal"
              >
                <Upload className="w-3 h-3" />
                <span>SUBMIT DATA</span>
              </button>
            </div>
          </nav>

          {/* SEARCH BAR (Matching the screenshot with 'All Databases', 'Search NCBI', and Brown/Tan 'Search' button) */}
          <div className="bg-gray-200 border-b border-gray-300 py-2.5 px-4">
            <div className="max-w-7xl mx-auto">
              <form onSubmit={(e) => handleSearchSubmit(e, downloadSearchQuery || 'NCBI datasets')} className="flex flex-col sm:flex-row items-center gap-1.5">
                <div className="relative w-full sm:w-44">
                  <select
                    value={selectedDatabase}
                    onChange={(e) => setSelectedDatabase(e.target.value)}
                    className="w-full bg-white text-gray-800 text-xs py-1.5 px-2.5 border border-gray-400 rounded-sm shadow-xs focus:outline-none"
                  >
                    <option>All Databases</option>
                    <option>PubMed</option>
                    <option>Nucleotide</option>
                    <option>Protein</option>
                    <option>Gene</option>
                    <option>Genome</option>
                    <option>SRA</option>
                  </select>
                </div>

                <div className="relative flex-1 w-full">
                  <input
                    type="text"
                    value={downloadSearchQuery}
                    onChange={(e) => setDownloadSearchQuery(e.target.value)}
                    placeholder="Search NCBI"
                    className="w-full bg-white text-gray-900 text-xs py-1.5 px-3 border border-gray-400 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-600 shadow-inner"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto bg-[#854d0e] hover:bg-[#713f12] text-white font-bold px-4 py-1.5 text-xs rounded-sm border border-[#713f12] transition flex items-center justify-center space-x-1.5 shadow-sm"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Search</span>
                </button>
              </form>
            </div>
          </div>

          {/* MAIN DOWNLOAD PAGE CONTENT */}
          <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">
            {/* HEADING */}
            <div className="space-y-3">
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                Download
              </h1>

              {/* GREY DESCRIPTION BANNER AS SHOWN IN SCREENSHOT */}
              <div className="bg-[#e2e8f0] border border-[#cbd5e1] text-gray-900 text-xs md:text-sm py-2.5 px-4 font-normal shadow-2xs rounded-xs">
                The majority of NCBI data are available for downloading, either directly from the NCBI FTP site or by using software tools to download custom datasets.
              </div>
            </div>

            {/* TWO-COLUMN LAYOUT: FEATURED NETWORK GRAPH IMAGE (LEFT) + ADDITIONAL LINKS (RIGHT) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* FEATURED BIOMEDICAL GRAPH VISUALIZATION BANNER (LEFT 8 COLS) */}
              <div className="lg:col-span-8 rounded-sm overflow-hidden border border-gray-400 bg-[#060c18] relative shadow-md">
                <div className="w-full h-64 md:h-72 relative flex items-center justify-center overflow-hidden">
                  {/* Molecular/Genomic Network Graph SVG */}
                  <svg className="w-full h-full" viewBox="0 0 600 300" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="netGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#1e1b4b" />
                        <stop offset="50%" stopColor="#0f172a" />
                        <stop offset="100%" stopColor="#020617" />
                      </linearGradient>
                      <radialGradient id="nodeGlowPurple" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#e879f9" />
                        <stop offset="60%" stopColor="#c026d3" />
                        <stop offset="100%" stopColor="#701a75" />
                      </radialGradient>
                      <radialGradient id="nodeGlowCyan" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#67e8f9" />
                        <stop offset="60%" stopColor="#0891b2" />
                        <stop offset="100%" stopColor="#164e63" />
                      </radialGradient>
                    </defs>

                    {/* Dark gradient backdrop */}
                    <rect width="600" height="300" fill="url(#netGrad)" />

                    {/* Network Lines */}
                    <g stroke="#818cf8" strokeWidth="0.8" strokeOpacity="0.4">
                      <line x1="80" y1="120" x2="160" y2="70" />
                      <line x1="160" y1="70" x2="240" y2="140" />
                      <line x1="240" y1="140" x2="180" y2="210" />
                      <line x1="180" y1="210" x2="90" y2="180" />
                      <line x1="90" y1="180" x2="80" y2="120" />
                      <line x1="240" y1="140" x2="320" y2="80" />
                      <line x1="320" y1="80" x2="410" y2="130" />
                      <line x1="160" y1="70" x2="320" y2="80" />
                      <line x1="180" y1="210" x2="280" y2="230" />
                      <line x1="280" y1="230" x2="410" y2="130" />
                      <line x1="320" y1="80" x2="280" y2="230" />
                      <line x1="410" y1="130" x2="480" y2="90" />
                      <line x1="480" y1="90" x2="540" y2="160" />
                      <line x1="410" y1="130" x2="510" y2="210" />
                      <line x1="510" y1="210" x2="540" y2="160" />
                    </g>

                    {/* Secondary cyan lines */}
                    <g stroke="#22d3ee" strokeWidth="0.6" strokeOpacity="0.35">
                      <line x1="60" y1="160" x2="140" y2="190" />
                      <line x1="140" y1="190" x2="210" y2="110" />
                      <line x1="210" y1="110" x2="350" y2="160" />
                      <line x1="350" y1="160" x2="450" y2="110" />
                      <line x1="450" y1="110" x2="520" y2="190" />
                    </g>

                    {/* Nodes (Glowing circles with labels) */}
                    <circle cx="80" cy="120" r="5" fill="url(#nodeGlowCyan)" />
                    <circle cx="160" cy="70" r="7" fill="url(#nodeGlowPurple)" />
                    <circle cx="240" cy="140" r="10" fill="url(#nodeGlowPurple)" />
                    <circle cx="180" cy="210" r="6" fill="url(#nodeGlowCyan)" />
                    <circle cx="90" cy="180" r="4" fill="url(#nodeGlowPurple)" />
                    <circle cx="320" cy="80" r="8" fill="url(#nodeGlowCyan)" />
                    <circle cx="410" cy="130" r="12" fill="url(#nodeGlowPurple)" />
                    <circle cx="280" cy="230" r="6" fill="url(#nodeGlowCyan)" />
                    <circle cx="480" cy="90" r="5" fill="url(#nodeGlowCyan)" />
                    <circle cx="540" cy="160" r="7" fill="url(#nodeGlowPurple)" />
                    <circle cx="510" cy="210" r="5" fill="url(#nodeGlowCyan)" />

                    {/* Coordinates & Accession Numbers Text Overlays */}
                    <text x="70" y="110" fill="#a5f3fc" fontSize="7" fontFamily="monospace">0.046987</text>
                    <text x="145" y="60" fill="#f0abfc" fontSize="7" fontFamily="monospace">0.8779987</text>
                    <text x="225" y="130" fill="#f0abfc" fontSize="8" fontFamily="monospace" fontWeight="bold">1/6</text>
                    <text x="310" y="70" fill="#a5f3fc" fontSize="7" fontFamily="monospace">0.99980614</text>
                    <text x="400" y="120" fill="#f0abfc" fontSize="9" fontFamily="monospace" fontWeight="bold">0.9856987</text>
                    <text x="495" y="80" fill="#a5f3fc" fontSize="7" fontFamily="monospace">0.44422784</text>
                    <text x="525" y="150" fill="#f0abfc" fontSize="7" fontFamily="monospace">0.9612307</text>

                    {/* Inset Zoom Box as seen in screenshot */}
                    <g transform="translate(190, 130)">
                      <rect x="0" y="0" width="220" height="110" fill="#030712" fillOpacity="0.85" stroke="#38bdf8" strokeWidth="1.2" />
                      <line x1="20" y1="50" x2="90" y2="30" stroke="#c084fc" strokeWidth="1.2" />
                      <line x1="90" y1="30" x2="160" y2="70" stroke="#c084fc" strokeWidth="1.2" />
                      <line x1="90" y1="30" x2="110" y2="85" stroke="#38bdf8" strokeWidth="1" />
                      <line x1="160" y1="70" x2="190" y2="40" stroke="#38bdf8" strokeWidth="1" />
                      <circle cx="20" cy="50" r="7" fill="url(#nodeGlowCyan)" />
                      <circle cx="90" cy="30" r="14" fill="url(#nodeGlowPurple)" />
                      <circle cx="160" cy="70" r="11" fill="url(#nodeGlowCyan)" />
                      <circle cx="110" cy="85" r="5" fill="url(#nodeGlowPurple)" />
                      <circle cx="190" cy="40" r="6" fill="url(#nodeGlowCyan)" />
                      <text x="82" y="34" fill="#ffffff" fontSize="9" fontWeight="bold" fontFamily="monospace">1/6</text>
                      <text x="75" y="15" fill="#f0abfc" fontSize="6" fontFamily="monospace">0.99980614</text>
                      <text x="145" y="60" fill="#a5f3fc" fontSize="6" fontFamily="monospace">0.9856987</text>
                    </g>
                  </svg>

                  {/* Banner caption label */}
                  <div className="absolute top-2 left-3 bg-black/60 px-2.5 py-1 rounded text-[10px] text-cyan-300 font-mono tracking-wider border border-cyan-800">
                    NCBI HIGH-THROUGHPUT BULK DOWNLOAD NETWORKS
                  </div>
                </div>
              </div>

              {/* RIGHT SIDEBAR: ADDITIONAL LINKS (RIGHT 4 COLS) */}
              <div className="lg:col-span-4 bg-white p-5 border border-gray-300 rounded-sm shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-gray-900 tracking-wide uppercase border-b border-gray-300 pb-2">
                  ADDITIONAL LINKS
                </h3>

                <ul className="space-y-3 text-xs text-blue-700 font-medium">
                  <li>
                    <button
                      onClick={() => setDownloadModal('custom')}
                      className="text-left hover:underline hover:text-blue-900 flex items-center space-x-1"
                    >
                      <span>How to download custom data sets</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setDownloadModal('practices')}
                      className="text-left hover:underline hover:text-blue-900 flex items-center space-x-1"
                    >
                      <span>Large Data Download Best Practices</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setDownloadModal('sra')}
                      className="text-left hover:underline hover:text-blue-900 flex items-center space-x-1"
                    >
                      <span>SRA Download Reference</span>
                    </button>
                  </li>
                </ul>

                {/* QUICK SUBMIT PROMPT BOX (Connecting page submit button) */}
                <div className="mt-6 pt-4 border-t border-gray-200 bg-blue-50/70 p-3 rounded text-xs space-y-2">
                  <span className="font-bold text-blue-900 flex items-center space-x-1">
                    <Upload className="w-3.5 h-3.5 text-blue-700" />
                    <span>Have data to deposit?</span>
                  </span>
                  <p className="text-[11px] text-gray-600 leading-snug">
                    Deposit raw sequences, assemblies, or manuscripts into NCBI repositories.
                  </p>
                  <button
                    onClick={() => navigateTo('submission')}
                    className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-1.5 px-3 rounded text-[11px] shadow-xs transition flex items-center justify-center space-x-1"
                  >
                    <span>Go to Submission Portal</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

            </div>

            {/* THREE DOWNLOAD OPTIONS (FTP, Aspera, Download Tools) AS SHOWN IN SCREENSHOT */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              
              {/* 1. FTP CARD */}
              <div
                onClick={() => setDownloadModal('ftp')}
                className="bg-white border border-gray-300 p-6 rounded-sm text-center cursor-pointer hover:border-blue-600 hover:shadow-md transition flex flex-col items-center justify-between group space-y-4"
              >
                <div className="space-y-1.5">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition">
                    FTP
                  </h3>
                  <p className="text-xs text-gray-600 max-w-xs mx-auto leading-relaxed">
                    Download data from the NCBI FTP site
                  </p>
                </div>

                {/* Download Tray Icon matching the screenshot */}
                <div className="pt-2 text-gray-600 group-hover:text-blue-700 transition">
                  <svg className="w-16 h-16 mx-auto stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                </div>

                <span className="text-[11px] text-blue-600 font-bold group-hover:underline">
                  Browse FTP Directories &rarr;
                </span>
              </div>

              {/* 2. ASPERA CARD */}
              <div
                onClick={() => setDownloadModal('aspera')}
                className="bg-white border border-gray-300 p-6 rounded-sm text-center cursor-pointer hover:border-blue-600 hover:shadow-md transition flex flex-col items-center justify-between group space-y-4"
              >
                <div className="space-y-1.5">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition">
                    Aspera
                  </h3>
                  <p className="text-xs text-gray-600 max-w-xs mx-auto leading-relaxed">
                    High-speed downloads provided by Aspera software
                  </p>
                </div>

                {/* Stylized Aspera Icon matching screenshot */}
                <div className="pt-2 text-gray-600 group-hover:text-blue-700 transition flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full border-4 border-current flex items-center justify-center font-black text-3xl font-sans tracking-tighter">
                    A
                  </div>
                </div>

                <span className="text-[11px] text-blue-600 font-bold group-hover:underline">
                  View Aspera CLI Setup &rarr;
                </span>
              </div>

              {/* 3. DOWNLOAD TOOLS CARD */}
              <div
                onClick={() => setDownloadModal('tools')}
                className="bg-white border border-gray-300 p-6 rounded-sm text-center cursor-pointer hover:border-blue-600 hover:shadow-md transition flex flex-col items-center justify-between group space-y-4"
              >
                <div className="space-y-1.5">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition">
                    Download Tools
                  </h3>
                  <p className="text-xs text-gray-600 max-w-xs mx-auto leading-relaxed">
                    Tools and APIs for downloading customized datasets
                  </p>
                </div>

                {/* Crossed Tools (Wrench and Screwdriver) Icon matching screenshot */}
                <div className="pt-2 text-gray-600 group-hover:text-blue-700 transition">
                  <svg className="w-16 h-16 mx-auto stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                    <line x1="2" y1="2" x2="6" y2="6" />
                  </svg>
                </div>

                <span className="text-[11px] text-blue-600 font-bold group-hover:underline">
                  Explore Command Line APIs &rarr;
                </span>
              </div>

            </div>

          </main>
        </div>
      ) : view === 'home' ? (
        /* =========================================================================
            VIEW 2: ORIGINAL NCBI HOME PAGE WITH SEARCH BAR
           ========================================================================= */
        <div className="flex-1 flex flex-col">
          {/* TOP NAVIGATION BAR */}
          <nav className={`border-b text-xs font-bold tracking-wide shadow-xs ${
            isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-gray-100 border-gray-300 text-gray-800'
          }`}>
            <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center space-x-4 md:space-x-6 overflow-x-auto whitespace-nowrap">
              <button onClick={() => navigateTo('home')} className="hover:text-blue-700 transition uppercase text-blue-900 font-extrabold border-b-2 border-blue-700 pb-0.5">
                NCBI HOME
              </button>
              <button onClick={() => handleSearchSubmit(undefined, 'Literature')} className="hover:text-blue-700 transition uppercase">
                LITERATURE
              </button>
              <button onClick={() => handleSearchSubmit(undefined, 'Health')} className="hover:text-blue-700 transition uppercase">
                HEALTH
              </button>
              <button onClick={() => handleSearchSubmit(undefined, 'Genomes')} className="hover:text-blue-700 transition uppercase">
                GENOMES
              </button>
              <button onClick={() => handleSearchSubmit(undefined, 'Genes')} className="hover:text-blue-700 transition uppercase">
                GENES
              </button>
              <button onClick={() => handleSearchSubmit(undefined, 'Proteins')} className="hover:text-blue-700 transition uppercase">
                PROTEINS
              </button>
              <button onClick={() => handleSearchSubmit(undefined, 'Chemicals')} className="hover:text-blue-700 transition uppercase">
                CHEMICALS
              </button>
              <button onClick={() => navigateTo('learn')} className="hover:text-blue-700 transition uppercase">
                LEARN
              </button>
              <button onClick={() => navigateTo('submission')} className="hover:text-blue-700 transition uppercase">
                SUBMIT
              </button>
              <button onClick={() => navigateTo('download')} className="hover:text-blue-700 transition uppercase">
                DOWNLOAD
              </button>
              <button onClick={() => navigateTo('analyze')} className="hover:text-blue-700 transition uppercase">
                ANALYZE
              </button>
              <button onClick={() => navigateTo('develop')} className="hover:text-blue-700 transition uppercase">
                DEVELOP
              </button>
              <button onClick={() => navigateTo('research')} className="hover:text-blue-700 transition uppercase">
                RESEARCH
              </button>
            </div>
          </nav>

          {/* SEARCH BAR (Matching reference screenshot: light gray background, All Databases dropdown, search input, blue search button) */}
          <div className="bg-gray-200 border-b border-gray-300 py-2.5 px-4">
            <div className="max-w-7xl mx-auto">
              <form onSubmit={(e) => handleSearchSubmit(e, searchQuery || 'NCBI datasets')} className="flex flex-col sm:flex-row items-center gap-1.5">
                <div className="relative w-full sm:w-44">
                  <select
                    value={selectedDatabase}
                    onChange={(e) => setSelectedDatabase(e.target.value)}
                    className="w-full bg-white text-gray-800 text-xs py-1.5 px-2.5 border border-gray-400 rounded-sm shadow-xs focus:outline-none"
                  >
                    <option>All Databases</option>
                    <option>PubMed</option>
                    <option>Nucleotide</option>
                    <option>Protein</option>
                    <option>Gene</option>
                    <option>Genome</option>
                    <option>SRA</option>
                  </select>
                </div>

                <div className="relative flex-1 w-full">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search NCBI"
                    className="w-full bg-white text-gray-900 text-xs py-1.5 px-3 border border-gray-400 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-600 shadow-inner"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto bg-blue-700 hover:bg-blue-800 text-white font-bold px-4 py-1.5 text-xs rounded-sm border border-blue-800 transition flex items-center justify-center space-x-1.5 shadow-sm"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Search</span>
                </button>
              </form>
            </div>
          </div>

          <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: Comprehensive Resource Sidebar (3 cols) */}
          <aside className="lg:col-span-3 space-y-4">
            <div className={`rounded-lg shadow-sm border overflow-hidden ${
              isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
            }`}>
              <div className={`px-4 py-2.5 font-bold text-xs uppercase tracking-wider border-b flex items-center justify-between ${
                isDarkMode ? 'bg-slate-700 text-blue-300 border-slate-600' : 'bg-[#e2e8f0] text-[#1e3a8a] border-gray-300'
              }`}>
                <span>Resources</span>
                <Layers className="w-3.5 h-3.5" />
              </div>
              <ul className="text-sm divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                {[
                  { name: 'NCBI Home', active: true, action: () => navigateTo('home') },
                  { name: 'Resource List (A-Z)', active: false, action: () => navigateTo('all_resources') },
                  { name: 'All Resources', active: false, action: () => navigateTo('all_resources') },
                  { name: 'Submission Portal', active: false, action: () => navigateTo('submission') },
                  { name: 'Download Data', active: false, action: () => navigateTo('download') },
                  { name: 'Chemicals & Bioassays', action: () => handleSidebarNav('Chemicals') },
                  { name: 'Data & Software', action: () => handleSidebarNav('Software') },
                  { name: 'DNA & RNA', action: () => handleSidebarNav('DNA') },
                  { name: 'Domains & Structures', action: () => handleSidebarNav('Structure') },
                  { name: 'Genes & Expression', action: () => handleSidebarNav('Gene') },
                  { name: 'Genetics & Medicine', action: () => handleSidebarNav('Clinical') },
                  { name: 'Genomes & Maps', action: () => handleSidebarNav('Genome') },
                  { name: 'Homology', action: () => handleSidebarNav('Homology') },
                  { name: 'Literature', action: () => handleSidebarNav('Literature') },
                  { name: 'Proteins', action: () => handleSidebarNav('Protein') },
                  { name: 'Sequence Analysis', action: () => handleSidebarNav('Sequence') },
                  { name: 'Taxonomy', action: () => handleSidebarNav('Taxonomy') },
                  { name: 'Training & Tutorials', action: () => handleSidebarNav('Training') },
                  { name: 'Variation', action: () => handleSidebarNav('Variation') }
                ].map((item, idx) => (
                  <li key={idx}>
                    <button
                      onClick={item.action}
                      className={`w-full text-left px-4 py-2 text-xs font-medium transition flex items-center justify-between ${
                        item.active
                          ? isDarkMode ? 'bg-blue-900/60 text-blue-200 font-bold border-l-4 border-blue-500' : 'bg-blue-100 font-bold border-l-4 border-blue-700 text-blue-900'
                          : isDarkMode ? 'text-slate-300 hover:bg-slate-700/50' : 'text-blue-900 hover:bg-blue-50'
                      }`}
                    >
                      <span>{item.name}</span>
                      <ArrowRight className="w-3 h-3 text-gray-400" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* CENTER COLUMN: 'Welcome to NCBI' & 6 PORTAL CARDS */}
          <main className="lg:col-span-6 space-y-6">
            <div className={`rounded-lg shadow-sm border p-6 md:p-8 space-y-6 ${
              isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-white border-gray-200 text-gray-900'
            }`}>
              <div className={`border-b pb-4 ${isDarkMode ? 'border-slate-700' : 'border-gray-200'}`}>
                <h2 className="text-2xl font-bold mb-2">Welcome to NCBI</h2>
                <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                  The National Center for Biotechnology Information advances science and health by providing access to biomedical and genomic information.
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-blue-400 font-medium">
                  <span onClick={() => navigateTo('all_resources')} className="hover:underline cursor-pointer">Resource List (A-Z)</span>
                  <span>|</span>
                  <span onClick={() => navigateTo('all_resources')} className="hover:underline cursor-pointer">All Resources</span>
                  <span>|</span>
                  <span onClick={() => navigateTo('submission')} className="hover:underline cursor-pointer">Submission Portal</span>
                </div>
              </div>

              {/* 6 PORTAL CARDS: SUBMIT -> /submission, DOWNLOAD -> /download */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    id: 'submit',
                    title: 'Submit',
                    desc: 'Deposit data or manuscripts into NCBI databases',
                    action: () => navigateTo('submission') // NAVIGATES INTERNALLY TO /submission
                  },
                  {
                    id: 'download',
                    title: 'Download',
                    desc: 'Transfer NCBI data to your computer',
                    action: () => navigateTo('download') // NAVIGATES INTERNALLY TO /download
                  },
                  {
                    id: 'learn',
                    title: 'Learn',
                    desc: 'Find help documents, attend a class or watch a tutorial',
                    action: () => navigateTo('learn') // NAVIGATES INTERNALLY TO /learn
                  },
                  {
                    id: 'develop',
                    title: 'Develop',
                    desc: 'Use NCBI APIs and code libraries to build applications',
                    action: () => navigateTo('develop') // NAVIGATES INTERNALLY TO /develop
                  },
                  {
                    id: 'analyze',
                    title: 'Analyze',
                    desc: 'Identify an NCBI tool for your data analysis task',
                    action: () => navigateTo('analyze') // NAVIGATES INTERNALLY TO /analyze
                  },
                  {
                    id: 'research',
                    title: 'Research',
                    desc: 'Explore NCBI research and collaborative projects',
                    action: () => navigateTo('research') // NAVIGATES INTERNALLY TO /research
                  }
                ].map((card) => (
                  <div
                    key={card.id}
                    onClick={card.action}
                    className={`border rounded-lg p-4 cursor-pointer transition flex flex-col items-center text-center group shadow-sm ${
                      isDarkMode ? 'bg-slate-700/50 border-slate-600 hover:bg-slate-700' : 'bg-[#fafbfc] border-gray-200 hover:bg-blue-50'
                    }`}
                  >
                    <h3 className="font-bold text-amber-500 text-base mb-1 group-hover:underline">{card.title}</h3>
                    <p className={`text-[11px] leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>{card.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </main>

          {/* RIGHT COLUMN: Popular Resources & NCBI News & Blog (3 cols) */}
          <aside className="lg:col-span-3 space-y-6">
            <div className={`p-5 rounded-lg border shadow-sm ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
              <h3 className={`font-bold border-b pb-2 mb-3 text-sm flex items-center justify-between ${isDarkMode ? 'border-slate-700 text-slate-100' : 'border-gray-200 text-gray-900'}`}>
                <span>Popular Resources</span>
                <span onClick={() => navigateTo('all_resources')} className="text-xs font-normal text-blue-400 cursor-pointer hover:underline">View All</span>
              </h3>
              <div className="grid grid-cols-1 gap-1.5 text-xs">
                {['PubMed', 'Bookshelf', 'PubMed Central', 'BLAST', 'Nucleotide', 'Genome', 'SNP', 'Gene', 'Protein', 'PubChem'].map((res, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSidebarNav(res)}
                    className={`text-left py-1.5 px-2 rounded truncate flex items-center justify-between group transition ${
                      isDarkMode ? 'hover:bg-slate-700 text-blue-300' : 'hover:bg-blue-50 text-blue-700'
                    }`}
                  >
                    <span className="truncate">{res}</span>
                    <ArrowRight className="w-3 h-3 text-gray-400" />
                  </button>
                ))}
              </div>
            </div>

            <div className={`p-5 rounded-lg border shadow-sm ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
              <h3 className={`font-bold border-b pb-2 mb-3 text-sm flex items-center justify-between ${isDarkMode ? 'border-slate-700 text-slate-100' : 'border-gray-200 text-gray-900'}`}>
                <span>NCBI News &amp; Blog</span>
              </h3>
              <div className="space-y-3 text-xs divide-y divide-gray-600/30">
                <div className="pt-2">
                  <p className="font-semibold hover:text-blue-400 cursor-pointer">A New Way to Explore Connections in Biomedical Literature</p>
                  <span className="text-[10px] text-gray-400 mt-0.5 block">24 Sep 2026</span>
                </div>
                <div className="pt-2">
                  <p className="font-semibold hover:text-blue-400 cursor-pointer">We&apos;re excited to announce Linked Discoveries™...</p>
                  <span className="text-[10px] text-gray-400 mt-0.5 block">16 Sep 2026</span>
                </div>
              </div>
            </div>
          </aside>

        </div>
      </div>
      ) : view === 'submission' ? (
        /* =========================================================================
            VIEW 3: SUBMISSION PORTAL INTERNAL PAGE (/submission)
           ========================================================================= */
        <div className="flex-1 flex flex-col">
          <nav className={`border-b px-4 md:px-6 py-2.5 text-xs font-semibold flex flex-wrap items-center justify-between gap-3 shadow-xs ${
            isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-gray-100 border-gray-300 text-gray-700'
          }`}>
            <div className="flex items-center space-x-6">
              <button
                onClick={() => setSubmitPortalTab('portal')}
                className={`transition pb-1 ${
                  submitPortalTab === 'portal'
                    ? 'text-blue-700 font-bold border-b-2 border-blue-700'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                Submission Portal
              </button>
              <button
                onClick={() => setSubmitPortalTab('my_submissions')}
                className={`transition pb-1 flex items-center space-x-1.5 ${
                  submitPortalTab === 'my_submissions'
                    ? 'text-blue-700 font-bold border-b-2 border-blue-700'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                <span>My submissions</span>
                <span className="bg-blue-100 text-blue-800 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  {submissionsList.length}
                </span>
              </button>
            </div>

            <div className="flex items-center space-x-3 text-xs">
              <button
                onClick={() => navigateTo('home')}
                className="text-gray-600 hover:text-blue-700 transition font-medium"
              >
                &larr; NCBI Home
              </button>
              <span>|</span>
              <button
                onClick={() => navigateTo('download')}
                className="text-gray-600 hover:text-blue-700 transition font-medium"
              >
                Download Data
              </button>
              <button
                onClick={() => openWizardForTool('SRA')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1 rounded text-xs shadow-xs transition flex items-center space-x-1"
              >
                <Upload className="w-3 h-3" />
                <span>Start Submission</span>
              </button>
            </div>
          </nav>

          <section className="bg-[#1e40af] text-white py-10 px-6 relative overflow-hidden shadow-inner">
            <div className="max-w-7xl mx-auto relative z-10 space-y-2">
              <div className="flex items-center space-x-2 text-blue-200 text-xs uppercase tracking-wider font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Official NCBI Data Deposition Service</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Submission Portal</h2>
              <p className="text-sm md:text-base text-blue-100 max-w-3xl leading-relaxed">
                Submit to the world&apos;s largest public repository of biological and scientific information
              </p>
            </div>
          </section>

          {submitPortalTab === 'portal' ? (
            <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 space-y-8">
              {/* SEARCH & SUGGEST SECTION */}
              <section className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold tracking-tight">What do you want to submit?</h3>
                  <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                    Enter a few words about your data and select an option to learn more or launch the submission tool.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Search className="w-4 h-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={submitQuery}
                      onChange={(e) => setSubmitQuery(e.target.value)}
                      placeholder="Search submission tool or repository (e.g. SRA, GenBank, genome, ClinVar)..."
                      className={`w-full border rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm ${
                        isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                    {submitQuery && (
                      <button
                        onClick={() => setSubmitQuery('')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      const q = submitQuery.toLowerCase();
                      if (q.includes('clin') || q.includes('var')) openWizardForTool('ClinVar');
                      else if (q.includes('genbank') || q.includes('rrna') || q.includes('gene')) openWizardForTool('GenBank');
                      else if (q.includes('geo') || q.includes('express')) openWizardForTool('GEO');
                      else if (q.includes('gap')) openWizardForTool('dbGaP');
                      else openWizardForTool('SRA');
                    }}
                    className="bg-[#0073e6] hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg text-sm transition shadow flex items-center justify-center space-x-2 whitespace-nowrap"
                  >
                    <span>Suggest tool &amp; Submit</span>
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-xs text-gray-500 font-medium mr-1">Popular targets:</span>
                  {[
                    { label: 'rRNA', tool: 'GenBank' },
                    { label: 'genome', tool: 'GenBank' },
                    { label: 'ITS', tool: 'GenBank' },
                    { label: 'SRA', tool: 'SRA' },
                    { label: 'Public Health-related', tool: 'SRA' },
                    { label: 'ClinVar', tool: 'ClinVar' },
                    { label: 'GEO expression', tool: 'GEO' }
                  ].map((pill, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSubmitQuery(pill.label);
                        openWizardForTool(pill.tool);
                      }}
                      className="bg-[#0073e6] hover:bg-blue-700 text-white text-xs font-semibold px-3.5 py-1.5 rounded-full flex items-center space-x-1.5 shadow-xs transition"
                    >
                      <Search className="w-3 h-3" />
                      <span>{pill.label}</span>
                    </button>
                  ))}
                </div>
              </section>

              {/* NAVIGATION TABS FOR SUBMISSION CATEGORIES */}
              <div className="border-b border-gray-200">
                <div className="flex space-x-6 text-sm font-semibold">
                  {[
                    { id: 'all', label: 'All Submission Tools' },
                    { id: 'sequences', label: 'Submit Sequences (SRA, GenBank)' },
                    { id: 'genomes', label: 'Submit Genomes & Assemblies' },
                    { id: 'clinical', label: 'Submit Clinical & Variation' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setSubmitActiveCategory(tab.id as any)}
                      className={`pb-3 transition ${
                        submitActiveCategory === tab.id
                          ? 'border-b-2 border-blue-600 text-blue-600 font-bold'
                          : 'text-gray-500 hover:text-gray-800'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* SUBMISSION TOOLS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch pt-2">
                {/* 1. SRA */}
                {(submitActiveCategory === 'all' || submitActiveCategory === 'sequences') && (
                  <div className={`p-6 rounded-xl border flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition ${
                    isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
                  }`}>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase bg-blue-100 text-blue-800 px-2 py-0.5 rounded">High-Throughput</span>
                        <span className="text-xs text-gray-400">Sequence Read Archive</span>
                      </div>
                      <h3
                        onClick={() => openWizardForTool('SRA')}
                        className="text-xl font-bold text-blue-600 hover:underline cursor-pointer"
                      >
                        Submit to SRA
                      </h3>
                      <p className={`text-xs md:text-sm leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                        The Sequence Read Archive accepts raw sequence data from Illumina, PacBio, Oxford Nanopore, and Complete Genomics.
                      </p>
                    </div>
                    <button
                      onClick={() => openWizardForTool('SRA')}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-4 rounded shadow transition flex items-center justify-center space-x-2"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Submit to SRA &rarr;</span>
                    </button>
                  </div>
                )}

                {/* 2. GenBank */}
                {(submitActiveCategory === 'all' || submitActiveCategory === 'sequences' || submitActiveCategory === 'genomes') && (
                  <div className={`p-6 rounded-xl border flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition ${
                    isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
                  }`}>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">GenBank / WGS</span>
                        <span className="text-xs text-gray-400">Nucleotide Database</span>
                      </div>
                      <h3
                        onClick={() => openWizardForTool('GenBank')}
                        className="text-xl font-bold text-blue-600 hover:underline cursor-pointer"
                      >
                        Submit to GenBank
                      </h3>
                      <p className={`text-xs md:text-sm leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                        Deposit annotated DNA/RNA sequences, complete genomes, plasmids, viral genomes, ribosomal RNA (rRNA), or barcodes.
                      </p>
                    </div>
                    <button
                      onClick={() => openWizardForTool('GenBank')}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-4 rounded shadow transition flex items-center justify-center space-x-2"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Submit to GenBank &rarr;</span>
                    </button>
                  </div>
                )}

                {/* 3. ClinVar */}
                {(submitActiveCategory === 'all' || submitActiveCategory === 'clinical') && (
                  <div className={`p-6 rounded-xl border flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition ${
                    isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
                  }`}>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase bg-purple-100 text-purple-800 px-2 py-0.5 rounded">Clinical</span>
                        <span className="text-xs text-gray-400">Genomic Variations</span>
                      </div>
                      <h3
                        onClick={() => openWizardForTool('ClinVar')}
                        className="text-xl font-bold text-blue-600 hover:underline cursor-pointer"
                      >
                        Submit to ClinVar
                      </h3>
                      <p className={`text-xs md:text-sm leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                        Deposit human genetic variations, interpretations of clinical significance, and phenotypes using VCF or spreadsheets.
                      </p>
                    </div>
                    <button
                      onClick={() => openWizardForTool('ClinVar')}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-4 rounded shadow transition flex items-center justify-center space-x-2"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Submit to ClinVar &rarr;</span>
                    </button>
                  </div>
                )}

                {/* 4. GEO */}
                {(submitActiveCategory === 'all' || submitActiveCategory === 'sequences') && (
                  <div className={`p-6 rounded-xl border flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition ${
                    isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
                  }`}>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded">Expression</span>
                        <span className="text-xs text-gray-400">Functional Genomics</span>
                      </div>
                      <h3
                        onClick={() => openWizardForTool('GEO')}
                        className="text-xl font-bold text-blue-600 hover:underline cursor-pointer"
                      >
                        Submit to GEO
                      </h3>
                      <p className={`text-xs md:text-sm leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                        Deposit microarray, RNA-seq, single-cell sequencing, ChIP-seq, and other high-throughput functional genomics datasets.
                      </p>
                    </div>
                    <button
                      onClick={() => openWizardForTool('GEO')}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-4 rounded shadow transition flex items-center justify-center space-x-2"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Submit to GEO &rarr;</span>
                    </button>
                  </div>
                )}

                {/* 5. BioProject & BioSample */}
                {(submitActiveCategory === 'all' || submitActiveCategory === 'genomes' || submitActiveCategory === 'sequences') && (
                  <div className={`p-6 rounded-xl border flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition ${
                    isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
                  }`}>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded">Metadata</span>
                        <span className="text-xs text-gray-400">BioProject / BioSample</span>
                      </div>
                      <h3
                        onClick={() => openWizardForTool('BioProject')}
                        className="text-xl font-bold text-blue-600 hover:underline cursor-pointer"
                      >
                        Submit BioProject
                      </h3>
                      <p className={`text-xs md:text-sm leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                        Register parent umbrella initiatives and biological sample descriptions prior to uploading genomic and transcriptomic reads.
                      </p>
                    </div>
                    <button
                      onClick={() => openWizardForTool('BioProject')}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-4 rounded shadow transition flex items-center justify-center space-x-2"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Submit BioProject &rarr;</span>
                    </button>
                  </div>
                )}

                {/* 6. dbGaP */}
                {(submitActiveCategory === 'all' || submitActiveCategory === 'clinical') && (
                  <div className={`p-6 rounded-xl border flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition ${
                    isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
                  }`}>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase bg-rose-100 text-rose-800 px-2 py-0.5 rounded">Controlled Access</span>
                        <span className="text-xs text-gray-400">Genotypes &amp; Phenotypes</span>
                      </div>
                      <h3
                        onClick={() => openWizardForTool('dbGaP')}
                        className="text-xl font-bold text-blue-600 hover:underline cursor-pointer"
                      >
                        Submit to dbGaP
                      </h3>
                      <p className={`text-xs md:text-sm leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                        Deposit controlled-access human genomic datasets resulting from NIH-funded Genome-Wide Association Studies (GWAS).
                      </p>
                    </div>
                    <button
                      onClick={() => openWizardForTool('dbGaP')}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-4 rounded shadow transition flex items-center justify-center space-x-2"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Submit to dbGaP &rarr;</span>
                    </button>
                  </div>
                )}
              </div>
            </main>
          ) : (
            /* MY SUBMISSIONS TAB VIEW */
            <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
                <div>
                  <h3 className="text-2xl font-bold">My Submissions</h3>
                  <p className="text-xs text-gray-500">Track and manage datasets deposited across NCBI repositories.</p>
                </div>
                <button
                  onClick={() => openWizardForTool('SRA')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded text-xs shadow flex items-center space-x-2 self-start"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>New Submission</span>
                </button>
              </div>

              <div className="border rounded-lg overflow-hidden bg-white shadow-xs">
                <table className="w-full text-xs text-left">
                  <thead className="bg-gray-100 text-gray-700 border-b uppercase font-bold tracking-wider">
                    <tr>
                      <th className="p-3">Submission ID</th>
                      <th className="p-3">Repository</th>
                      <th className="p-3">Title / Study</th>
                      <th className="p-3">Organism</th>
                      <th className="p-3">Assigned Accession</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Date</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {submissionsList.map((sub) => (
                      <tr key={sub.id} className="hover:bg-blue-50/50 transition">
                        <td className="p-3 font-mono font-bold text-blue-900">{sub.id}</td>
                        <td className="p-3">
                          <span className="bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded text-[10px]">
                            {sub.tool}
                          </span>
                        </td>
                        <td className="p-3 font-medium text-gray-900 max-w-xs truncate">{sub.title}</td>
                        <td className="p-3 italic text-gray-600">{sub.organism}</td>
                        <td className="p-3 font-mono font-bold text-emerald-700">{sub.accession}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                            sub.status === 'Published'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {sub.status}
                          </span>
                        </td>
                        <td className="p-3 text-gray-500">{sub.date}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => copyToClipboard(sub.accession)}
                            className="text-blue-600 hover:underline font-semibold"
                          >
                            Copy Accession
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </main>
          )}
        </div>
      ) : view === 'learn' ? (
        /* =========================================================================
            VIEW 5: LEARN INTERNAL PAGE (/learn) - REPLICATING ATTACHED SCREENSHOT
           ========================================================================= */
        <div className="flex-1 flex flex-col">
          {/* TOP NAVIGATION BAR AS SHOWN IN SCREENSHOT */}
          <nav className={`border-b text-xs font-bold tracking-wide shadow-xs ${
            isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-gray-100 border-gray-300 text-gray-800'
          }`}>
            <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center space-x-4 md:space-x-6 overflow-x-auto whitespace-nowrap">
              <button onClick={() => navigateTo('home')} className="hover:text-blue-700 transition uppercase">
                NCBI HOME
              </button>
              <button onClick={() => handleSearchSubmit(undefined, 'Literature')} className="hover:text-blue-700 transition uppercase">
                LITERATURE
              </button>
              <button onClick={() => handleSearchSubmit(undefined, 'Health')} className="hover:text-blue-700 transition uppercase">
                HEALTH
              </button>
              <button onClick={() => handleSearchSubmit(undefined, 'Genomes')} className="hover:text-blue-700 transition uppercase">
                GENOMES
              </button>
              <button onClick={() => handleSearchSubmit(undefined, 'Genes')} className="hover:text-blue-700 transition uppercase">
                GENES
              </button>
              <button onClick={() => handleSearchSubmit(undefined, 'Proteins')} className="hover:text-blue-700 transition uppercase">
                PROTEINS
              </button>
              <button onClick={() => handleSearchSubmit(undefined, 'Chemicals')} className="hover:text-blue-700 transition uppercase">
                CHEMICALS
              </button>
              <button onClick={() => navigateTo('learn')} className="hover:text-blue-700 transition uppercase text-blue-900 font-extrabold border-b-2 border-blue-700 pb-0.5">
                LEARN
              </button>
              <button onClick={() => navigateTo('submission')} className="hover:text-blue-700 transition uppercase text-blue-800 font-bold">
                SUBMIT
              </button>
            </div>
          </nav>

          {/* SEARCH BAR */}
          <div className="bg-gray-200 border-b border-gray-300 py-2.5 px-4">
            <div className="max-w-7xl mx-auto">
              <form onSubmit={(e) => handleSearchSubmit(e, learnSearchQuery || 'NCBI education')} className="flex flex-col sm:flex-row items-center gap-1.5">
                <div className="relative w-full sm:w-44">
                  <select
                    value={selectedDatabase}
                    onChange={(e) => setSelectedDatabase(e.target.value)}
                    className="w-full bg-white text-gray-800 text-xs py-1.5 px-2.5 border border-gray-400 rounded-sm shadow-xs focus:outline-none"
                  >
                    <option>All Databases</option>
                    <option>PubMed</option>
                    <option>Nucleotide</option>
                    <option>Protein</option>
                    <option>Gene</option>
                    <option>Genome</option>
                    <option>Bookshelf</option>
                  </select>
                </div>

                <div className="relative flex-1 w-full">
                  <input
                    type="text"
                    value={learnSearchQuery}
                    onChange={(e) => setLearnSearchQuery(e.target.value)}
                    placeholder="Search NCBI"
                    className="w-full bg-white text-gray-900 text-xs py-1.5 px-3 border border-gray-400 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-600 shadow-inner"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto bg-[#854d0e] hover:bg-[#713f12] text-white font-bold px-4 py-1.5 text-xs rounded-sm border border-[#713f12] transition flex items-center justify-center space-x-1.5 shadow-sm"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Search</span>
                </button>
              </form>
            </div>
          </div>

          {/* MAIN LEARN CONTENT */}
          <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8 space-y-6">
              <div className="space-y-3">
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                  Learn
                </h1>

                <div className="bg-[#e2e8f0] border border-[#cbd5e1] text-gray-900 text-xs md:text-sm py-2.5 px-4 font-normal shadow-2xs rounded-xs leading-relaxed">
                  NCBI creates a variety of educational products including courses, workshops, webinars, training materials and documentation. NCBI educational events are free and open to everyone. All NCBI educational materials are available for anyone to re-use and distribute.
                </div>
              </div>

              {/* LECTURE TRAINING SVG / BANNER IMAGE */}
              <div className="rounded-sm overflow-hidden border border-gray-400 bg-gray-900 relative shadow-md">
                <div className="w-full h-64 md:h-72 relative flex items-center justify-center overflow-hidden bg-gradient-to-tr from-slate-900 via-blue-950 to-indigo-950">
                  <svg className="w-full h-full opacity-90" viewBox="0 0 600 300" preserveAspectRatio="none">
                    <rect width="600" height="300" fill="#0b1329" />
                    <rect x="180" y="40" width="240" height="130" fill="#f8fafc" rx="2" />
                    <rect x="190" y="50" width="220" height="110" fill="#1e3a8a" opacity="0.1" />
                    <text x="210" y="90" fill="#1e3a8a" fontSize="14" fontWeight="bold" fontFamily="sans-serif">NCBI Genomic Workshop</text>
                    <text x="210" y="115" fill="#475569" fontSize="10" fontFamily="sans-serif">Advanced BLAST &amp; Sequence Analysis</text>
                    <circle cx="390" cy="135" r="12" fill="#cbd5e1" />
                    <path d="M375 170 Q390 148 405 170 Z" fill="#3b82f6" />
                    <g fill="#334155" opacity="0.9">
                      <circle cx="100" cy="230" r="15" /><path d="M80 270 Q100 230 120 270 Z" />
                      <circle cx="150" cy="225" r="14" /><path d="M132 265 Q150 225 168 265 Z" />
                      <circle cx="205" cy="235" r="16" /><path d="M185 280 Q205 235 225 280 Z" />
                      <circle cx="260" cy="220" r="14" /><path d="M242 260 Q260 220 278 260 Z" />
                      <circle cx="320" cy="240" r="15" /><path d="M300 285 Q320 240 340 285 Z" />
                      <circle cx="380" cy="225" r="14" /><path d="M362 265 Q380 225 398 265 Z" />
                      <circle cx="440" cy="235" r="16" /><path d="M420 280 Q440 235 460 280 Z" />
                      <circle cx="500" cy="220" r="15" /><path d="M480 260 Q500 220 520 260 Z" />
                    </g>
                  </svg>
                  <div className="absolute top-2 left-3 bg-black/60 px-2.5 py-1 rounded text-[10px] text-blue-300 font-mono tracking-wider border border-blue-800">
                    NCBI LIVE TRAINING &amp; EDUCATIONAL WORKSHOPS
                  </div>
                </div>
              </div>

              {/* 4 CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div
                  onClick={() => setLearnModal('webinars')}
                  className="bg-white border border-gray-300 p-6 rounded-sm cursor-pointer hover:border-blue-600 hover:shadow-md transition flex flex-col justify-between group space-y-4"
                >
                  <div className="space-y-1.5">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition">
                      Webinars &amp; Courses
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      In-person courses, live webinars and webinar recordings
                    </p>
                  </div>
                  <div className="pt-2 text-gray-500 group-hover:text-blue-700 transition flex items-center justify-between">
                    <div className="w-10 h-10 border-2 border-current rounded flex items-center justify-center">
                      <Play className="w-5 h-5" />
                    </div>
                    <span className="text-xs text-blue-600 font-bold group-hover:underline">Explore &rarr;</span>
                  </div>
                </div>

                <div
                  onClick={() => setLearnModal('conferences')}
                  className="bg-white border border-gray-300 p-6 rounded-sm cursor-pointer hover:border-blue-600 hover:shadow-md transition flex flex-col justify-between group space-y-4"
                >
                  <div className="space-y-1.5">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition">
                      Conferences &amp; Presentations
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Booth exhibits and workshops at scientific conferences
                    </p>
                  </div>
                  <div className="pt-2 text-gray-500 group-hover:text-blue-700 transition flex items-center justify-between">
                    <div className="w-10 h-10 border-2 border-current rounded flex items-center justify-center">
                      <FileText className="w-5 h-5" />
                    </div>
                    <span className="text-xs text-blue-600 font-bold group-hover:underline">View schedule &rarr;</span>
                  </div>
                </div>

                <div
                  onClick={() => setLearnModal('tutorials')}
                  className="bg-white border border-gray-300 p-6 rounded-sm cursor-pointer hover:border-blue-600 hover:shadow-md transition flex flex-col justify-between group space-y-4"
                >
                  <div className="space-y-1.5">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition">
                      Tutorials
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Tutorials: Training materials in HTML, PDF and video formats
                    </p>
                  </div>
                  <div className="pt-2 text-gray-500 group-hover:text-blue-700 transition flex items-center justify-between">
                    <div className="w-10 h-10 border-2 border-current rounded flex items-center justify-center font-black text-lg">
                      i
                    </div>
                    <span className="text-xs text-blue-600 font-bold group-hover:underline">Browse tutorials &rarr;</span>
                  </div>
                </div>

                <div
                  onClick={() => setLearnModal('docs')}
                  className="bg-white border border-gray-300 p-6 rounded-sm cursor-pointer hover:border-blue-600 hover:shadow-md transition flex flex-col justify-between group space-y-4"
                >
                  <div className="space-y-1.5">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition">
                      Documentation
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Online manuals, handbooks, fact sheets and FAQs
                    </p>
                  </div>
                  <div className="pt-2 text-gray-500 group-hover:text-blue-700 transition flex items-center justify-between">
                    <div className="w-10 h-10 border-2 border-current rounded flex items-center justify-center">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <span className="text-xs text-blue-600 font-bold group-hover:underline">Read docs &rarr;</span>
                  </div>
                </div>
              </div>

              {/* NEWS, BLOG & SOCIAL MEDIA BANNER */}
              <div className="bg-[#e2e8f0] border border-[#cbd5e1] p-4 rounded-sm flex items-start space-x-3 shadow-xs">
                <MessageSquare className="w-6 h-6 text-blue-800 flex-shrink-0 mt-1" />
                <div className="space-y-1">
                  <h4 className="font-bold text-gray-900 text-sm">News, Blog &amp; Social Media</h4>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    Keep up with the latest NCBI news and follow NCBI on social media sites, including Facebook, Twitter, Google+, LinkedIn and the NCBI Insights blog.
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT 4 COLS: NCBI NEWS & BLOG */}
            <div className="lg:col-span-4 bg-white p-5 border border-gray-300 rounded-sm shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-blue-800 tracking-wide uppercase border-b border-gray-300 pb-2 flex items-center justify-between">
                <span>NCBI News &amp; Blog</span>
                <span onClick={() => alert('Viewing all NCBI blog updates.')} className="text-xs font-normal text-blue-600 cursor-pointer hover:underline">More...</span>
              </h3>

              <div className="space-y-4 text-xs divide-y divide-gray-200">
                <div className="pt-2">
                  <p className="font-semibold text-blue-700 hover:underline cursor-pointer">A New Way to Explore Connections in Biomedical Literature</p>
                  <span className="text-[10px] text-gray-500 mt-1 block">24 Sep 2026</span>
                  <p className="text-gray-600 mt-1 leading-snug">We&apos;re excited to announce the launch of Linked Discoveries™, a new experimental pilot resource developed by the National Library of Medicine...</p>
                </div>
                <div className="pt-3">
                  <p className="font-semibold text-blue-700 hover:underline cursor-pointer">dbGaP Modernization Update</p>
                  <span className="text-[10px] text-gray-500 mt-1 block">16 Sep 2026</span>
                  <p className="text-gray-600 mt-1 leading-snug">NCBI is modernizing the database of Genotype and Phenotype (dbGaP), a repository that collects human research study data...</p>
                </div>
                <div className="pt-3">
                  <p className="font-semibold text-blue-700 hover:underline cursor-pointer">Discover the Enhanced SRA Run Browser User Interface</p>
                  <span className="text-[10px] text-gray-500 mt-1 block">15 Sep 2026</span>
                  <p className="text-gray-600 mt-1 leading-snug">If you use NCBI&apos;s Sequence Read Archive&apos;s (SRA) Run Browser, you will be excited to explore the updated user interface (UI)...</p>
                </div>
              </div>
            </div>
          </main>
        </div>
      ) : view === 'analyze' ? (
        /* =========================================================================
            VIEW 6: ANALYZE INTERNAL PAGE (/analyze) - REPLICATING ATTACHED SCREENSHOT
           ========================================================================= */
        <div className="flex-1 flex flex-col">
          {/* TOP NAVIGATION BAR AS SHOWN IN SCREENSHOT */}
          <nav className={`border-b text-xs font-bold tracking-wide shadow-xs ${
            isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-gray-100 border-gray-300 text-gray-800'
          }`}>
            <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center space-x-4 md:space-x-6 overflow-x-auto whitespace-nowrap">
              <button onClick={() => navigateTo('home')} className="hover:text-blue-700 transition uppercase">
                NCBI HOME
              </button>
              <button onClick={() => handleSearchSubmit(undefined, 'Literature')} className="hover:text-blue-700 transition uppercase">
                LITERATURE
              </button>
              <button onClick={() => handleSearchSubmit(undefined, 'Health')} className="hover:text-blue-700 transition uppercase">
                HEALTH
              </button>
              <button onClick={() => handleSearchSubmit(undefined, 'Genomes')} className="hover:text-blue-700 transition uppercase">
                GENOMES
              </button>
              <button onClick={() => handleSearchSubmit(undefined, 'Genes')} className="hover:text-blue-700 transition uppercase">
                GENES
              </button>
              <button onClick={() => handleSearchSubmit(undefined, 'Proteins')} className="hover:text-blue-700 transition uppercase">
                PROTEINS
              </button>
              <button onClick={() => handleSearchSubmit(undefined, 'Chemicals')} className="hover:text-blue-700 transition uppercase">
                CHEMICALS
              </button>
              <button onClick={() => navigateTo('learn')} className="hover:text-blue-700 transition uppercase">
                LEARN
              </button>
              <button onClick={() => navigateTo('submission')} className="hover:text-blue-700 transition uppercase">
                SUBMIT
              </button>
              <button onClick={() => navigateTo('analyze')} className="hover:text-blue-700 transition uppercase text-blue-900 font-extrabold border-b-2 border-blue-700 pb-0.5">
                ANALYZE
              </button>
            </div>
          </nav>

          {/* SEARCH BAR */}
          <div className="bg-gray-200 border-b border-gray-300 py-2.5 px-4">
            <div className="max-w-7xl mx-auto">
              <form onSubmit={(e) => handleSearchSubmit(e, 'NCBI analysis tools')} className="flex flex-col sm:flex-row items-center gap-1.5">
                <div className="relative w-full sm:w-44">
                  <select
                    value={selectedDatabase}
                    onChange={(e) => setSelectedDatabase(e.target.value)}
                    className="w-full bg-white text-gray-800 text-xs py-1.5 px-2.5 border border-gray-400 rounded-sm shadow-xs focus:outline-none"
                  >
                    <option>All Databases</option>
                    <option>PubMed</option>
                    <option>Nucleotide</option>
                    <option>Protein</option>
                    <option>Gene</option>
                    <option>Genome</option>
                    <option>Bookshelf</option>
                  </select>
                </div>

                <div className="relative flex-1 w-full">
                  <input
                    type="text"
                    placeholder="Search NCBI"
                    className="w-full bg-white text-gray-900 text-xs py-1.5 px-3 border border-gray-400 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-600 shadow-inner"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto bg-[#854d0e] hover:bg-[#713f12] text-white font-bold px-4 py-1.5 text-xs rounded-sm border border-[#713f12] transition flex items-center justify-center space-x-1.5 shadow-sm"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Search</span>
                </button>
              </form>
            </div>
          </div>

          {/* MAIN ANALYZE CONTENT */}
          <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">
            <div className="space-y-3">
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                Analyze
              </h1>
              <div className="bg-[#e2e8f0] border border-[#cbd5e1] text-gray-900 text-xs md:text-sm py-2 px-3 font-normal shadow-2xs rounded-xs">
                NCBI provides a wide variety of data analysis tools that allow users to manipulate, align, visualize and evaluate biological data.
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Selected Analysis Tools</h2>

              <div className="flex flex-wrap gap-1.5 border-b border-gray-300 pb-3">
                {['All Tools', 'Literature', 'Health', 'Genomes', 'Genes', 'Proteins', 'Chemicals'].map((tab, idx) => (
                  <button
                    key={idx}
                    className={`px-3 py-1 rounded text-xs font-semibold border transition ${
                      idx === 0
                        ? 'bg-white border-blue-600 text-blue-900 shadow-xs'
                        : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* TABLE FILTER INPUT */}
              <div className="flex items-center space-x-2 bg-gray-50 p-2 border border-gray-300 rounded-xs">
                <span className="text-xs font-bold text-gray-700">Filter this table:</span>
                <input
                  type="text"
                  placeholder="Type to filter tools..."
                  className="bg-white border border-gray-300 text-xs px-2 py-1 rounded-sm w-full max-w-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              {/* TOOLS TABLE */}
              <div className="border border-gray-300 rounded-xs overflow-hidden bg-white shadow-xs">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#e2e8f0] text-gray-900 border-b border-gray-300 font-bold">
                    <tr>
                      <th className="p-3 w-1/3 border-r border-gray-300">Tools</th>
                      <th className="p-3">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[
                      { tool: 'Amino Acid Explorer', desc: 'Explores amino acid properties, substitutions and functions' },
                      { tool: 'Assembly Archive', desc: 'Links the raw sequence information found in the Trace Archive with assembly information found in GenBank/EMBL/DDBJ' },
                      { tool: 'Basic Local Alignment Search Tool (BLAST)', desc: 'Finds regions of local similarity between biological sequences' },
                      { tool: 'Batch Entrez', desc: 'Retrieves records specified in an uploaded file of identifiers' },
                      { tool: 'BioAssay Services', desc: 'Tools that summarize the biological test results in the PubChem database' },
                      { tool: 'BLAST Link (BLink)', desc: 'Displays the results of a pre-computed BLAST search of a protein against all other protein sequences at NCBI' },
                      { tool: 'BLAST Microbial Genomes', desc: 'Finds regions of local similarity between query sequences and sequences from complete microbial genomes' },
                      { tool: 'BLAST RefSeqGene', desc: 'Finds regions of local similarity between query sequences and genomic sequences in the RefSeqGene/LRG set' },
                      { tool: 'Comparative Genome Viewer (CGV)', desc: 'Compare genomes based on whole genome assembly-assembly alignments' },
                      { tool: 'Multiple Comparative Genome Viewer (MCGV)', desc: 'MCGV is a graphical display for whole genome multiple sequence alignments.' },
                      { tool: 'Cn3D', desc: 'Displays and manipulates 3-dimensional structures and alignments from the Structure database' },
                      { tool: 'COBALT', desc: 'Performs protein multiple sequence alignments' },
                      { tool: 'Concise Microbial Protein BLAST', desc: 'Finds regions of local similarity between query proteins and proteins from complete microbial (prokaryotic) genomes' },
                      { tool: 'Conserved Domain Architecture Retrieval Tool (CDART)', desc: 'Displays the functional domains that make up a given protein sequence' },
                      { tool: 'Conserved Domain Search Service (CD Search)', desc: 'Identifies the conserved domains present in a protein sequence' },
                      { tool: 'Digital Differential Display (DDD)', desc: 'Identifies genes with significantly different expression levels by comparing EST profiles' },
                      { tool: 'Electronic PCR (e-PCR)', desc: 'Identifies sequence tagged sites (STSs) within DNA sequences' },
                      { tool: 'Frequency-weighted Link (FLink)', desc: 'Links a group of records in a source database to a ranked list of associated records in a destination database based on frequency-weighted statistics' },
                      { tool: 'Gene Expression Omnibus (GEO) BLAST', desc: 'Finds regions of local similarity between query sequences and GenBank sequences included on microarray or SAGE platforms in the GEO database' },
                      { tool: 'Genetic Codes', desc: 'Displays the genetic codes for organisms in the Taxonomy database in tables and on a taxonomic tree' },
                      { tool: 'Genome BLAST', desc: 'Finds regions of local similarity between query sequences and genome sequences' },
                      { tool: 'Genome Data Viewer (GDV)', desc: 'Genome Data Viewer (GDV) is a genome browser supporting the exploration and analysis of more than 740 eukaryotic RefSeq genome assemblies.' },
                      { tool: 'Genome ProtMap', desc: 'Maps each protein from a COG or VOG back to its genome' },
                      { tool: 'LinkOut', desc: 'Allows third parties to link directly from PubMed abstracts and other Entrez database records to relevant web-accessible resources beyond the Entrez system' },
                      { tool: 'Open Reading Frame Finder (ORF Finder)', desc: 'Suggests potential open reading frames in a DNA sequence' },
                      { tool: 'OSIRIS', desc: 'Facilitates the assessment of multiplex short tandem repeat (STR) DNA profiles based on laboratory-specific protocols' }
                    ].map((row, idx) => (
                      <tr key={idx} className="hover:bg-blue-50/50 transition">
                        <td className="p-3 font-semibold text-blue-700 border-r border-gray-200 cursor-pointer hover:underline">
                          {row.tool}
                        </td>
                        <td className="p-3 text-gray-700">{row.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      ) : view === 'develop' ? (
        /* =========================================================================
            VIEW 7: DEVELOP INTERNAL PAGE (/develop)
           ========================================================================= */
        <div className="flex-1 flex flex-col">
          <nav className={`border-b text-xs font-bold tracking-wide shadow-xs ${
            isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-gray-100 border-gray-300 text-gray-800'
          }`}>
            <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center space-x-4 md:space-x-6 overflow-x-auto whitespace-nowrap">
              <button onClick={() => navigateTo('home')} className="hover:text-blue-700 transition uppercase">NCBI HOME</button>
              <button onClick={() => navigateTo('learn')} className="hover:text-blue-700 transition uppercase">LEARN</button>
              <button onClick={() => navigateTo('submission')} className="hover:text-blue-700 transition uppercase">SUBMIT</button>
              <button onClick={() => navigateTo('download')} className="hover:text-blue-700 transition uppercase">DOWNLOAD</button>
              <button onClick={() => navigateTo('analyze')} className="hover:text-blue-700 transition uppercase">ANALYZE</button>
              <button onClick={() => navigateTo('develop')} className="hover:text-blue-700 transition uppercase text-blue-900 font-extrabold border-b-2 border-blue-700 pb-0.5">DEVELOP</button>
              <button onClick={() => navigateTo('research')} className="hover:text-blue-700 transition uppercase">RESEARCH</button>
            </div>
          </nav>

          <div className="bg-gray-200 border-b border-gray-300 py-2.5 px-4">
            <div className="max-w-7xl mx-auto">
              <form onSubmit={(e) => handleSearchSubmit(e, 'NCBI APIs')} className="flex flex-col sm:flex-row items-center gap-1.5">
                <div className="relative flex-1 w-full">
                  <input
                    type="text"
                    placeholder="Search NCBI APIs & SDKs"
                    className="w-full bg-white text-gray-900 text-xs py-1.5 px-3 border border-gray-400 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-600 shadow-inner"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-[#854d0e] hover:bg-[#713f12] text-white font-bold px-4 py-1.5 text-xs rounded-sm border border-[#713f12] transition flex items-center justify-center space-x-1.5 shadow-sm"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Search APIs</span>
                </button>
              </form>
            </div>
          </div>

          <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">
            <div className="space-y-3">
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Develop with NCBI APIs &amp; Code Libraries</h1>
              <div className="bg-[#e2e8f0] border border-[#cbd5e1] text-gray-900 text-xs md:text-sm py-2 px-3 font-normal rounded-xs">
                Use NCBI E-utilities, REST APIs, and command-line SDKs to integrate biomedical databases directly into your applications.
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: 'Entrez Programming Utilities (E-utilities)', desc: 'Powerful server-side interface to all Entrez databases supporting search, fetch, and summary operations via URL or POST.' },
                { title: 'NCBI Datasets API', desc: 'Modern REST API and CLI tool to query and download genome assemblies, genes, annotations, and coronavirus data.' },
                { title: 'Entrez Direct (EDirect)', desc: 'Unix command-line integration suite for querying Entrez databases and piping records into downstream UNIX tools.' }
              ].map((tool, idx) => (
                <div key={idx} className="bg-white border border-gray-300 p-5 rounded-sm shadow-xs space-y-3">
                  <h3 className="font-bold text-blue-800 text-base">{tool.title}</h3>
                  <p className="text-xs text-gray-700 leading-relaxed">{tool.desc}</p>
                  <button onClick={() => alert(`Opening developer documentation for ${tool.title}`)} className="text-xs text-blue-600 font-bold hover:underline">
                    View API Reference &rarr;
                  </button>
                </div>
              ))}
            </div>
          </main>
        </div>
      ) : view === 'research' ? (
        /* =========================================================================
            VIEW 8: RESEARCH INTERNAL PAGE (/research)
           ========================================================================= */
        <div className="flex-1 flex flex-col">
          <nav className={`border-b text-xs font-bold tracking-wide shadow-xs ${
            isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-gray-100 border-gray-300 text-gray-800'
          }`}>
            <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center space-x-4 md:space-x-6 overflow-x-auto whitespace-nowrap">
              <button onClick={() => navigateTo('home')} className="hover:text-blue-700 transition uppercase">NCBI HOME</button>
              <button onClick={() => navigateTo('learn')} className="hover:text-blue-700 transition uppercase">LEARN</button>
              <button onClick={() => navigateTo('submission')} className="hover:text-blue-700 transition uppercase">SUBMIT</button>
              <button onClick={() => navigateTo('download')} className="hover:text-blue-700 transition uppercase">DOWNLOAD</button>
              <button onClick={() => navigateTo('analyze')} className="hover:text-blue-700 transition uppercase">ANALYZE</button>
              <button onClick={() => navigateTo('develop')} className="hover:text-blue-700 transition uppercase">DEVELOP</button>
              <button onClick={() => navigateTo('research')} className="hover:text-blue-700 transition uppercase text-blue-900 font-extrabold border-b-2 border-blue-700 pb-0.5">RESEARCH</button>
            </div>
          </nav>

          <div className="bg-gray-200 border-b border-gray-300 py-2.5 px-4">
            <div className="max-w-7xl mx-auto">
              <form onSubmit={(e) => handleSearchSubmit(e, 'NCBI Research')} className="flex flex-col sm:flex-row items-center gap-1.5">
                <div className="relative flex-1 w-full">
                  <input
                    type="text"
                    placeholder="Search NCBI Research Projects"
                    className="w-full bg-white text-gray-900 text-xs py-1.5 px-3 border border-gray-400 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-600 shadow-inner"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-[#854d0e] hover:bg-[#713f12] text-white font-bold px-4 py-1.5 text-xs rounded-sm border border-[#713f12] transition flex items-center justify-center space-x-1.5 shadow-sm"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Search Research</span>
                </button>
              </form>
            </div>
          </div>

          <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">
            <div className="space-y-3">
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">NCBI Research &amp; Scientific Projects</h1>
              <div className="bg-[#e2e8f0] border border-[#cbd5e1] text-gray-900 text-xs md:text-sm py-2 px-3 font-normal rounded-xs">
                Explore advanced computational biology, algorithmic research, and collaborative scientific initiatives conducted by NCBI scientists.
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: 'Computational Biology Branch (CBB)', desc: 'Conducts theoretical and applied research in molecular sequence analysis, protein structure prediction, and genome annotation algorithms.' },
                { title: 'Biomedical Text Mining & AI Research', desc: 'Developing state-of-the-art natural language processing models and knowledge graphs to extract biomedical insights from millions of literature citations.' },
                { title: 'Pathogen Detection & Surveillance', desc: 'Genomic epidemiology research tracking foodborne pathogens, antimicrobial resistance, and viral evolution in real-time.' },
                { title: 'Postdoctoral Fellowship Programs', desc: 'Training the next generation of bioinformaticians and computational biologists through NIH intramural research fellowships.' }
              ].map((proj, idx) => (
                <div key={idx} className="bg-white border border-gray-300 p-5 rounded-sm shadow-xs space-y-3">
                  <h3 className="font-bold text-blue-800 text-base">{proj.title}</h3>
                  <p className="text-xs text-gray-700 leading-relaxed">{proj.desc}</p>
                  <button onClick={() => alert(`Opening research details for ${proj.title}`)} className="text-xs text-blue-600 font-bold hover:underline">
                    Read Research Publication &rarr;
                  </button>
                </div>
              ))}
            </div>
          </main>
        </div>
      ) : (
        <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <aside className="lg:col-span-3 space-y-4">
            <div className={`rounded-lg shadow-sm border overflow-hidden ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
              <div className={`px-4 py-2.5 font-bold text-xs uppercase tracking-wider border-b flex items-center justify-between ${isDarkMode ? 'bg-slate-700 text-blue-300 border-slate-600' : 'bg-[#e2e8f0] text-[#1e3a8a] border-gray-300'}`}>
                <span>Resources</span>
                <Layers className="w-3.5 h-3.5" />
              </div>
              <ul className="text-sm divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                {[
                  { name: 'NCBI Home', active: false, action: () => navigateTo('home') },
                  { name: 'Download Data', active: false, action: () => navigateTo('download') },
                  { name: 'Submission Portal', active: false, action: () => navigateTo('submission') },
                  { name: 'Resource List (A-Z)', active: view === 'all_resources', action: () => navigateTo('all_resources') },
                  { name: 'All Resources', active: view === 'all_resources', action: () => navigateTo('all_resources') }
                ].map((item, idx) => (
                  <li key={idx}>
                    <button onClick={item.action} className={`w-full text-left px-4 py-2 text-xs font-medium transition ${item.active ? 'bg-blue-100 font-bold text-blue-900' : 'text-blue-900 hover:bg-blue-50'}`}>
                      {item.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <main className="lg:col-span-9 space-y-6">
            {view === 'all_resources' && (
              <div className={`rounded-lg shadow-sm border p-6 md:p-8 space-y-6 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-white border-gray-200 text-gray-900'}`}>
                <div className="border-b pb-4">
                  <h2 className="text-3xl font-extrabold">NCBI All Resources &amp; Databases Directory</h2>
                </div>
                <div className="space-y-6">
                  {[
                    {
                      title: 'Literature',
                      items: [{ name: 'PubMed', desc: 'Over 35 million citations for biomedical literature.', urlQuery: 'PubMed' }, { name: 'PubMed Central', desc: 'Free full-text archive.', urlQuery: 'PMC' }]
                    },
                    {
                      title: 'DNA & RNA',
                      items: [{ name: 'GenBank', desc: 'NIH genetic sequence database.', urlQuery: 'GenBank' }, { name: 'Nucleotide', desc: 'Combined sequence records.', urlQuery: 'Nucleotide' }]
                    }
                  ].map((cat, idx) => (
                    <div key={idx} className={`border rounded-lg p-5 space-y-3 ${isDarkMode ? 'bg-slate-700/40 border-slate-600' : 'bg-[#fafbfc] border-gray-200'}`}>
                      <h3 className="font-bold text-blue-400 text-base">{cat.title}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {cat.items.map((item, i) => (
                          <div key={i} onClick={() => { setSearchQuery(item.urlQuery); navigateTo('search'); }} className="border rounded p-3 cursor-pointer hover:border-blue-400 bg-white text-gray-900">
                            <h4 className="font-bold text-blue-700 text-xs">{item.name}</h4>
                            <p className="text-[11px] text-gray-600 mt-1">{item.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SEARCH RESULTS VIEW */}
            {view === 'search' && (
              <div className={`rounded-lg shadow-sm border p-6 space-y-6 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-white border-gray-200 text-gray-900'}`}>
                <div className={`flex flex-col md:flex-row md:items-center justify-between border-b pb-4 gap-4 ${isDarkMode ? 'border-slate-700' : 'border-gray-200'}`}>
                  <div>
                    <button onClick={() => navigateTo('home')} className="text-xs text-blue-400 hover:underline font-medium">&larr; Back to Home</button>
                    <h2 className="text-xl font-bold mt-1">Search results for &quot;{searchQuery}&quot; ({searchResults.filter(r => !organismFilter || (r.organism && r.organism.toLowerCase().includes(organismFilter.toLowerCase()))).length} records)</h2>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="Filter by organism (e.g. Homo sapiens)..."
                      value={organismFilter}
                      onChange={(e) => setOrganismFilter(e.target.value)}
                      className={`text-xs px-3 py-1.5 border rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-600 ${
                        isDarkMode ? 'bg-slate-700 border-slate-600 text-slate-100' : 'bg-white border-gray-300 text-gray-800'
                      }`}
                    />
                    {organismFilter && (
                      <button onClick={() => setOrganismFilter('')} className="text-xs text-blue-600 hover:underline">Clear</button>
                    )}
                  </div>
                </div>

                {/* CATEGORY TABS */}
                <div className="flex flex-wrap gap-2 border-b pb-3">
                  {(['All', 'Literature', 'Genes', 'Proteins', 'Genomes', 'BLAST'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab as any)}
                      className={`px-3 py-1.5 rounded text-xs font-bold transition border ${
                        activeTab === tab
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : isDarkMode ? 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600' : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {tab === 'BLAST' ? '🧬 BLAST Sequence Search' : tab}
                    </button>
                  ))}
                </div>

                {/* BLAST TAB CONTENT */}
                {activeTab === 'BLAST' ? (
                  <div className={`p-6 rounded-lg border space-y-4 ${isDarkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-blue-50/50 border-blue-200'}`}>
                    <div className="space-y-1">
                      <h3 className="font-bold text-base text-blue-700 dark:text-blue-300">NCBI BLAST+ Sequence Similarity Search</h3>
                      <p className="text-xs text-gray-600 dark:text-slate-300">
                        Paste nucleotide or protein sequence (FASTA format or raw letters) to find homologous regions in GenBank, RefSeq, and SRA.
                      </p>
                    </div>

                    <textarea
                      rows={4}
                      value={blastSeqInput}
                      onChange={(e) => setBlastSeqInput(e.target.value)}
                      placeholder=">Query_Sequence_1&#10;ATGCGATCGATCGATCGATCGATCGATCGATCGATC..."
                      className={`w-full font-mono text-xs p-3 border rounded shadow-inner focus:outline-none focus:ring-1 focus:ring-blue-600 ${
                        isDarkMode ? 'bg-slate-900 border-slate-600 text-slate-200' : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />

                    <div className="flex items-center space-x-3">
                      <button
                        onClick={runBlast}
                        disabled={isBlastRunning || !blastSeqInput.trim()}
                        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold px-5 py-2 rounded text-xs shadow flex items-center space-x-2 transition"
                      >
                        {isBlastRunning && <Loader2 className="w-4 h-4 animate-spin" />}
                        <span>Run NCBI BLAST Search</span>
                      </button>
                    </div>

                    {blastResultData && (
                      <div className="mt-4 space-y-3 pt-4 border-t border-blue-200 dark:border-slate-600">
                        <div className="flex items-center justify-between text-xs font-bold text-blue-900 dark:text-blue-200">
                          <span>BLAST Job ID: {blastResultData.jobId}</span>
                          <span>Query Length: {blastResultData.queryLength} bp</span>
                        </div>

                        <div className="space-y-2">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-slate-400">Significant Alignments:</h4>
                          {blastResultData.alignments.map((aln: any, idx: number) => (
                            <div key={idx} className={`p-3 rounded border space-y-1 text-xs ${isDarkMode ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-300'}`}>
                              <div className="flex items-center justify-between">
                                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{aln.accession}</span>
                                <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">Ident: {aln.identity}</span>
                              </div>
                              <p className="font-medium">{aln.description}</p>
                              <p className="text-[11px] text-gray-500">Score: {aln.score} bits | E-value: {aln.eValue} | Query Cover: {aln.queryCover}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : isSearchLoading ? (
                  <div className="py-16 flex flex-col items-center justify-center space-y-3">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    <p className="text-xs text-gray-500">Querying NCBI E-utilities API ({selectedDatabase})...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {searchResults
                      .filter(res => {
                        const matchesOrg = !organismFilter || (res.organism && res.organism.toLowerCase().includes(organismFilter.toLowerCase()));
                        const matchesTab = activeTab === 'All' || res.category === activeTab;
                        return matchesOrg && matchesTab;
                      })
                      .map(res => (
                        <div key={res.id} className={`border rounded-lg p-5 shadow-sm transition space-y-3 ${
                          isDarkMode ? 'bg-slate-700/40 border-slate-600 hover:border-blue-400' : 'bg-white border-gray-200 hover:border-blue-400'
                        }`}>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-900/60 text-blue-200 rounded uppercase">{res.category}</span>
                            <span className={`text-xs font-semibold font-mono ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>{res.pmid || res.accession}</span>
                          </div>

                          <h3 onClick={() => { setSelectedResult(res); navigateTo('detail'); }} className="text-base font-bold text-blue-400 hover:underline cursor-pointer">
                            {res.title}
                          </h3>

                          <p className={`text-xs font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>{res.authors} — <span className="italic">{res.journal} ({res.year})</span></p>

                          <p className={`text-xs ${isDarkMode ? 'text-slate-300' : 'text-gray-600'} line-clamp-2`}>{res.snippet}</p>

                          {res.organism && (
                            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium italic">Organism: {res.organism}</p>
                          )}

                          {aiSummaries[res.id] && (
                            <div className="bg-gradient-to-r from-blue-950 to-indigo-950 border border-blue-700 rounded p-3 text-xs text-blue-200">
                              <strong className="flex items-center space-x-1 mb-1 font-bold"><Sparkles className="w-3.5 h-3.5 text-blue-400" /><span>Gemini AI Biomedical Summary:</span></strong>
                              {aiSummaries[res.id]}
                            </div>
                          )}

                          <div className={`flex items-center space-x-3 pt-2 border-t ${isDarkMode ? 'border-slate-600' : 'border-gray-100'}`}>
                            <button
                              onClick={() => generateAiSummary(res)}
                              disabled={aiLoadingId === res.id}
                              className="bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-700 text-xs font-semibold px-3 py-1.5 rounded transition flex items-center space-x-1.5"
                            >
                              {aiLoadingId === res.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-indigo-400" />}
                              <span>{aiSummaries[res.id] ? 'AI Summary Loaded' : '✨ AI Biomedical Summary'}</span>
                            </button>

                            <button
                              onClick={() => { setSelectedResult(res); navigateTo('detail'); }}
                              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded shadow transition"
                            >
                              View Full Record &amp; Details &rarr;
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}

            {view === 'detail' && selectedResult && (
              <div className={`rounded-lg shadow-sm border p-6 md:p-8 space-y-6 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-white border-gray-200 text-gray-900'}`}>
                <button onClick={() => navigateTo('search')} className="text-xs text-blue-400 hover:underline">&larr; Back to Results</button>
                <h1 className="text-2xl font-bold">{selectedResult.title}</h1>
                <p className="text-sm bg-white text-gray-900 p-4 rounded border">{selectedResult.fullAbstract || selectedResult.snippet}</p>
              </div>
            )}
          </main>
        </div>
      )}

      {/* =========================================================================
          DOWNLOAD PAGE INTERACTIVE MODALS (FTP, Aspera, Tools, Additional Links)
         ========================================================================= */}
      {downloadModal === 'ftp' && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full p-6 relative text-gray-900 space-y-4 max-h-[90vh] overflow-y-auto">
            <button onClick={() => setDownloadModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-3 border-b pb-3">
              <FolderDown className="w-6 h-6 text-blue-700" />
              <div>
                <h3 className="text-lg font-bold">NCBI FTP Directory Browser</h3>
                <p className="text-xs text-gray-500">ftp.ncbi.nlm.nih.gov / Anonymous FTP Access</p>
              </div>
            </div>

            <div className="text-xs space-y-3">
              <p className="text-gray-700">Directly download public biomedical assemblies, RefSeq releases, and taxonomy databases:</p>
              
              <div className="border rounded divide-y divide-gray-100 bg-gray-50 font-mono text-[11px]">
                {[
                  { dir: '/pub/refseq/release/complete/', desc: 'Complete RefSeq genomic assembly package (FASTA, GFF3)', size: '24.8 GB' },
                  { dir: '/pub/taxonomy/', desc: 'Taxonomy dump tables (taxdump.tar.gz)', size: '64.2 MB' },
                  { dir: '/pub/geo/DATA/SeriesMatrix/', desc: 'Gene Expression Omnibus normalized matrix files', size: '1.2 TB' },
                  { dir: '/pub/pmc/oa_bulk/', desc: 'PubMed Central Open Access XML text collections', size: '480 GB' },
                  { dir: '/pub/clinvar/vcf_GRCh38/', desc: 'ClinVar monthly variation release VCF', size: '115 MB' }
                ].map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between hover:bg-blue-50 transition">
                    <div>
                      <span className="font-bold text-blue-800">{item.dir}</span>
                      <p className="text-gray-600 font-sans text-xs mt-0.5">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => alert(`Starting download simulation for ${item.dir} (${item.size})`)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1 rounded text-xs transition whitespace-nowrap ml-3"
                    >
                      Download ({item.size})
                    </button>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-blue-50 rounded border border-blue-200 text-blue-900 font-sans">
                <strong>FTP Host:</strong> <code>ftp.ncbi.nlm.nih.gov</code> | <strong>Protocol:</strong> HTTPS / FTPS | <strong>Anonymous:</strong> enabled
              </div>
            </div>
            
            <div className="flex justify-end pt-2 border-t">
              <button onClick={() => setDownloadModal(null)} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded text-xs font-semibold">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {downloadModal === 'aspera' && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full p-6 relative text-gray-900 space-y-4">
            <button onClick={() => setDownloadModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-3 border-b pb-3">
              <Zap className="w-6 h-6 text-amber-600" />
              <div>
                <h3 className="text-lg font-bold">Aspera High-Speed Data Transfer</h3>
                <p className="text-xs text-gray-500">Accelerated UDP-based file transfer for petabyte datasets</p>
              </div>
            </div>

            <div className="text-xs space-y-3">
              <p className="text-gray-700">Aspera Connect enables high-throughput transfers for massive Sequence Read Archive (SRA) runs and full GenBank flatfiles without TCP latency penalties.</p>
              
              <div className="bg-gray-900 text-emerald-400 p-3 rounded font-mono text-[11px] relative">
                <button
                  onClick={() => copyToClipboard('ascp -i ~/.aspera/connect/etc/asperaweb_id_dsa.openssh -k 1 -T -l 200m anonftp@ftp.ncbi.nlm.nih.gov:/sra/sra-instant/reads/ByRun/sra/SRR/SRR000/SRR000001/ ./')}
                  className="absolute top-2 right-2 text-xs bg-gray-800 hover:bg-gray-700 text-gray-200 px-2 py-1 rounded flex items-center space-x-1"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedCmd ? 'Copied!' : 'Copy'}</span>
                </button>
                <p className="text-gray-400 mb-1"># Sample Aspera CLI Command:</p>
                <code>ascp -i ~/.aspera/connect/etc/asperaweb_id_dsa.openssh -k 1 -T -l 200m anonftp@ftp.ncbi.nlm.nih.gov:/sra/reads/ByRun/ ./</code>
              </div>

              <div className="border rounded p-3 space-y-1 bg-gray-50">
                <h4 className="font-bold text-gray-800">Requirements:</h4>
                <ul className="list-disc list-inside text-gray-600 space-y-0.5">
                  <li>Aspera Connect Desktop client or <code>ascp</code> CLI tool installed.</li>
                  <li>Outbound UDP port 33001 and TCP port 22 open on firewall.</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t">
              <button onClick={() => setDownloadModal(null)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold">
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {downloadModal === 'tools' && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full p-6 relative text-gray-900 space-y-4 max-h-[90vh] overflow-y-auto">
            <button onClick={() => setDownloadModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-3 border-b pb-3">
              <Wrench className="w-6 h-6 text-blue-700" />
              <div>
                <h3 className="text-lg font-bold">NCBI Download Tools &amp; Command Line Suite</h3>
                <p className="text-xs text-gray-500">Programmatic APIs, SDKs, and CLI download utilities</p>
              </div>
            </div>

            <div className="text-xs space-y-4">
              <div className="border rounded p-3 bg-gray-50 space-y-1.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-blue-900 text-sm">1. NCBI Datasets CLI</h4>
                  <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded">Recommended</span>
                </div>
                <p className="text-gray-600">Streamlined command-line tool to query and download genome assemblies, genes, and viruses:</p>
                <div className="bg-gray-900 text-emerald-400 p-2 rounded font-mono text-[11px]">
                  datasets download genome accession GCF_000001405.40 --include gff3,rna,cds
                </div>
              </div>

              <div className="border rounded p-3 bg-gray-50 space-y-1.5">
                <h4 className="font-bold text-blue-900 text-sm">2. SRA Toolkit (fasterq-dump)</h4>
                <p className="text-gray-600">Fast extraction of FASTQ files directly from SRA accessions:</p>
                <div className="bg-gray-900 text-emerald-400 p-2 rounded font-mono text-[11px]">
                  fasterq-dump SRR000001 --threads 6 --progress
                </div>
              </div>

              <div className="border rounded p-3 bg-gray-50 space-y-1.5">
                <h4 className="font-bold text-blue-900 text-sm">3. Entrez Direct (EDirect)</h4>
                <p className="text-gray-600">Unix command-line access to all NCBI Entrez databases:</p>
                <div className="bg-gray-900 text-emerald-400 p-2 rounded font-mono text-[11px]">
                  esearch -db pubmed -query &quot;CRISPR DNA&quot; | efetch -format medline
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t">
              <button onClick={() => setDownloadModal(null)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADDITIONAL LINKS MODALS */}
      {downloadModal === 'custom' && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full p-6 relative text-gray-900 space-y-4">
            <button onClick={() => setDownloadModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            <h3 className="text-lg font-bold border-b pb-2">How to Download Custom Data Sets</h3>
            <p className="text-xs text-gray-700 leading-relaxed">
              Use NCBI Datasets or E-utilities to create tailored downloads restricted by taxon, assembly level, or annotation status. You can export metadata in JSON/CSV and download sequence files in standard FASTA format.
            </p>
            <div className="flex justify-end pt-2 border-t">
              <button onClick={() => setDownloadModal(null)} className="px-4 py-2 bg-blue-600 text-white rounded text-xs font-semibold">Close</button>
            </div>
          </div>
        </div>
      )}

      {downloadModal === 'practices' && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full p-6 relative text-gray-900 space-y-4">
            <button onClick={() => setDownloadModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            <h3 className="text-lg font-bold border-b pb-2">Large Data Download Best Practices</h3>
            <ul className="text-xs text-gray-700 space-y-2 list-disc list-inside leading-relaxed">
              <li>Always check MD5 checksums provided alongside FTP archives.</li>
              <li>Schedule automated scripts during off-peak hours (9 PM to 5 AM US Eastern Time).</li>
              <li>Limit automated E-utility requests to a maximum of 3 requests per second without an API key (10 per second with a free NCBI API key).</li>
            </ul>
            <div className="flex justify-end pt-2 border-t">
              <button onClick={() => setDownloadModal(null)} className="px-4 py-2 bg-blue-600 text-white rounded text-xs font-semibold">Close</button>
            </div>
          </div>
        </div>
      )}

      {downloadModal === 'sra' && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full p-6 relative text-gray-900 space-y-4">
            <button onClick={() => setDownloadModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            <h3 className="text-lg font-bold border-b pb-2">SRA Download Reference</h3>
            <p className="text-xs text-gray-700 leading-relaxed">
              Sequence Read Archive files are hosted across NCBI, AWS Open Data, and Google Cloud Platform. You can download SRA runs using <code>prefetch</code> and <code>fasterq-dump</code> from the SRA Toolkit or access them directly via cloud bucket URIs.
            </p>
            <div className="flex justify-end pt-2 border-t">
              <button onClick={() => setDownloadModal(null)} className="px-4 py-2 bg-blue-600 text-white rounded text-xs font-semibold">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* LEARN PAGE INTERACTIVE MODALS */}
      {learnModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full p-6 relative text-gray-900 space-y-4 max-h-[90vh] overflow-y-auto">
            <button onClick={() => setLearnModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-3 border-b pb-3">
              <BookOpen className="w-6 h-6 text-blue-700" />
              <div>
                <h3 className="text-lg font-bold capitalize">NCBI {learnModal} Hub</h3>
                <p className="text-xs text-gray-500">Official National Center for Biotechnology Information Educational Material</p>
              </div>
            </div>

            <div className="text-xs space-y-3">
              {learnModal === 'webinars' && (
                <>
                  <p className="text-gray-700">Explore upcoming live training sessions and watch our complete library of recorded webinars on Entrez, BLAST, Datasets, and RefSeq:</p>
                  <div className="border rounded divide-y divide-gray-100 bg-gray-50">
                    <div className="p-3 hover:bg-blue-50 transition cursor-pointer" onClick={() => alert('Joining webinar session room...')}>
                      <span className="font-bold text-blue-800 block">Introduction to NCBI Datasets CLI &amp; API (Live Webinar)</span>
                      <span className="text-gray-500 text-[11px]">October 18, 2026 — 2:00 PM EST (1 hour)</span>
                    </div>
                    <div className="p-3 hover:bg-blue-50 transition cursor-pointer" onClick={() => alert('Joining webinar session room...')}>
                      <span className="font-bold text-blue-800 block">Advanced BLAST Search Strategies &amp; Parameters</span>
                      <span className="text-gray-500 text-[11px]">October 25, 2026 — 1:00 PM EST (90 mins)</span>
                    </div>
                  </div>
                </>
              )}

              {learnModal === 'conferences' && (
                <>
                  <p className="text-gray-700">Meet NCBI scientists and educators at upcoming scientific conferences, booth exhibits, and hands-on workshops:</p>
                  <div className="border rounded divide-y divide-gray-100 bg-gray-50">
                    <div className="p-3">
                      <span className="font-bold text-blue-800 block">American Society of Human Genetics (ASHG) Annual Meeting</span>
                      <span className="text-gray-500 text-[11px]">Denver, CO — Booth #402 &amp; Workshop Session B</span>
                    </div>
                    <div className="p-3">
                      <span className="font-bold text-blue-800 block">Plant &amp; Animal Genome (PAG) Conference</span>
                      <span className="text-gray-500 text-[11px]">San Diego, CA — NCBI Datasets Hands-on Lab</span>
                    </div>
                  </div>
                </>
              )}

              {learnModal === 'tutorials' && (
                <>
                  <p className="text-gray-700">Step-by-step training materials in HTML, PDF, and video formats:</p>
                  <div className="border rounded divide-y divide-gray-100 bg-gray-50">
                    <div className="p-3 hover:bg-blue-50 transition cursor-pointer" onClick={() => alert('Opening PDF tutorial handbook...')}>
                      <span className="font-bold text-blue-800 block">PubMed Searching &amp; MeSH Term Mastery (PDF)</span>
                    </div>
                    <div className="p-3 hover:bg-blue-50 transition cursor-pointer" onClick={() => alert('Opening video tutorial...')}>
                      <span className="font-bold text-blue-800 block">Sequence Read Archive (SRA) Data Mining Video Course</span>
                    </div>
                  </div>
                </>
              )}

              {learnModal === 'docs' && (
                <>
                  <p className="text-gray-700">Comprehensive online manuals, handbooks, fact sheets and FAQs:</p>
                  <div className="border rounded divide-y divide-gray-100 bg-gray-50">
                    <div className="p-3">
                      <span className="font-bold text-blue-800 block">The NCBI Handbook (2nd Edition)</span>
                      <span className="text-gray-500 text-[11px]">Detailed overview of NCBI resources, architecture, and Entrez programming utilities.</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t">
              <button onClick={() => setLearnModal(null)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          INTERACTIVE NCBI SUBMISSION WIZARD MODAL (isWizardOpen)
         ========================================================================= */}
      {isWizardOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 relative text-gray-900 space-y-5 max-h-[92vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-900 text-white font-bold p-2 rounded-lg shadow-sm">
                  <Upload className="w-5 h-5 text-blue-200" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                    <span>NCBI {wizardTool} Submission Wizard</span>
                    <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded uppercase">
                      Official Deposition
                    </span>
                  </h3>
                  <p className="text-xs text-gray-500">
                    Deposit scientific datasets into National Center for Biotechnology Information repositories
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsWizardOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-md transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stepper indicator if not finished */}
            {!submittedAccession && (
              <div className="grid grid-cols-4 gap-2 text-center text-xs border-b pb-3 font-semibold">
                {[
                  { num: 1, label: '1. Project Info' },
                  { num: 2, label: '2. Organism' },
                  { num: 3, label: '3. Data Files' },
                  { num: 4, label: '4. Review & Submit' }
                ].map(s => (
                  <div
                    key={s.num}
                    onClick={() => { if (wizardStep > s.num) setWizardStep(s.num); }}
                    className={`py-1.5 px-1 rounded transition cursor-pointer ${
                      wizardStep === s.num
                        ? 'bg-blue-600 text-white shadow-xs'
                        : wizardStep > s.num
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    <span>{s.label}</span>
                  </div>
                ))}
              </div>
            )}

            {/* STEP 1: Project Info */}
            {wizardStep === 1 && !submittedAccession && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-gray-800 mb-1">
                    Study / Submission Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={wizardTitle}
                    onChange={(e) => setWizardTitle(e.target.value)}
                    placeholder="e.g. Whole Genome Sequencing of clinical bacterial isolates"
                    className="w-full text-xs border border-gray-300 rounded p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-800 mb-1">
                      Lead Submitter Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={wizardSubmitterName}
                      onChange={(e) => setWizardSubmitterName(e.target.value)}
                      className="w-full text-xs border border-gray-300 rounded p-2.5"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-800 mb-1">
                      Institutional Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={wizardEmail}
                      onChange={(e) => setWizardEmail(e.target.value)}
                      className="w-full text-xs border border-gray-300 rounded p-2.5"
                    />
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 p-3 rounded text-gray-700 space-y-1">
                  <span className="font-bold text-blue-900 block">Release Preference:</span>
                  <label className="flex items-center space-x-2 cursor-pointer mt-1">
                    <input type="radio" name="release" defaultChecked className="text-blue-600" />
                    <span>Release immediately upon NCBI curation and indexing</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="radio" name="release" className="text-blue-600" />
                    <span>Hold until publication (embargo up to 1 year)</span>
                  </label>
                </div>

                <div className="flex justify-end pt-3 border-t">
                  <button
                    onClick={() => setWizardStep(2)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded text-xs transition flex items-center space-x-1.5"
                  >
                    <span>Next: Specimen Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Organism & Platform */}
            {wizardStep === 2 && !submittedAccession && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-gray-800 mb-1">
                    Taxon / Scientific Name <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={wizardOrganism}
                    onChange={(e) => setWizardOrganism(e.target.value)}
                    className="w-full text-xs border border-gray-300 rounded p-2.5 bg-white"
                  >
                    <option value="Homo sapiens">Homo sapiens (human) [NCBI TaxId: 9606]</option>
                    <option value="Mus musculus">Mus musculus (house mouse) [NCBI TaxId: 10090]</option>
                    <option value="Escherichia coli">Escherichia coli K-12 [NCBI TaxId: 562]</option>
                    <option value="Mycobacterium tuberculosis">Mycobacterium tuberculosis [NCBI TaxId: 1773]</option>
                    <option value="Arabidopsis thaliana">Arabidopsis thaliana [NCBI TaxId: 3702]</option>
                    <option value="SARS-CoV-2">Severe acute respiratory syndrome coronavirus 2 [TaxId: 2697049]</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-800 mb-1">
                    Sequencing Platform &amp; Instrument Model
                  </label>
                  <select
                    value={wizardPlatform}
                    onChange={(e) => setWizardPlatform(e.target.value)}
                    className="w-full text-xs border border-gray-300 rounded p-2.5 bg-white"
                  >
                    <option>Illumina NovaSeq 6000 (Paired-end 150bp)</option>
                    <option>Illumina NextSeq 2000</option>
                    <option>Oxford Nanopore GridION / PromethION</option>
                    <option>PacBio Sequel IIe (HiFi circular consensus reads)</option>
                    <option>Complete Genomics DNBSEQ-T7</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 border rounded bg-gray-50">
                    <span className="font-bold text-gray-700 block mb-1">Library Strategy:</span>
                    <span className="text-gray-600">WGS (Whole Genome Shotgun)</span>
                  </div>
                  <div className="p-3 border rounded bg-gray-50">
                    <span className="font-bold text-gray-700 block mb-1">Library Selection:</span>
                    <span className="text-gray-600">Random PCR / Size Fractionated</span>
                  </div>
                </div>

                <div className="flex justify-between pt-3 border-t">
                  <button
                    onClick={() => setWizardStep(1)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-4 py-2 rounded text-xs transition"
                  >
                    &larr; Back
                  </button>
                  <button
                    onClick={() => setWizardStep(3)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded text-xs transition flex items-center space-x-1.5"
                  >
                    <span>Next: Attach Files</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Files & Data */}
            {wizardStep === 3 && !submittedAccession && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-gray-800 mb-1">
                    Upload Raw Sequence Reads or Assemblies (FASTQ, FASTA, BAM, XML)
                  </label>
                  <div className="border-2 border-dashed border-blue-300 rounded-lg p-5 text-center bg-blue-50/50 hover:bg-blue-50 transition">
                    <Upload className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="font-semibold text-gray-800">Drag &amp; drop sequencing files or browse your drive</p>
                    <p className="text-[11px] text-gray-500 mt-1">Accepts .fastq.gz, .fq.gz, .fasta, .bam, .vcf, or .tar</p>
                    <button
                      onClick={() => {
                        const newFilename = `sample_lane_${wizardFiles.length + 1}_R1.fastq.gz`;
                        setWizardFiles(prev => [...prev, newFilename]);
                      }}
                      className="mt-3 bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded text-xs transition shadow-xs"
                    >
                      + Add Sample Read File
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="font-bold text-gray-700 block">Staged Upload Queue ({wizardFiles.length} files):</span>
                  <div className="divide-y divide-gray-100 border rounded max-h-40 overflow-y-auto font-mono text-[11px] bg-gray-50">
                    {wizardFiles.map((f, i) => (
                      <div key={i} className="p-2.5 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="font-semibold text-gray-800">{f}</span>
                          <span className="text-gray-400 font-sans text-[10px]">(3.8 GB)</span>
                        </div>
                        <button
                          onClick={() => setWizardFiles(prev => prev.filter((_, idx) => idx !== i))}
                          className="text-red-500 hover:underline font-sans text-xs"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between pt-3 border-t">
                  <button
                    onClick={() => setWizardStep(2)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-4 py-2 rounded text-xs transition"
                  >
                    &larr; Back
                  </button>
                  <button
                    onClick={() => setWizardStep(4)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded text-xs transition flex items-center space-x-1.5"
                  >
                    <span>Next: Final Review</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Review & Submit (Before confirmation) */}
            {wizardStep === 4 && !submittedAccession && (
              <div className="space-y-4 text-xs">
                <div className="bg-amber-50 border border-amber-200 p-3 rounded space-y-1 text-amber-900">
                  <span className="font-bold block flex items-center space-x-1">
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    <span>NCBI Deposition Verification Ready</span>
                  </span>
                  <p className="text-[11px] leading-relaxed">
                    Please review your dataset summary before initiating the final deposit into NCBI.
                  </p>
                </div>

                <div className="border rounded-lg divide-y divide-gray-100 bg-white">
                  <div className="p-3 flex justify-between">
                    <span className="font-bold text-gray-500">Repository Target:</span>
                    <span className="font-bold text-blue-900">{wizardTool}</span>
                  </div>
                  <div className="p-3 flex justify-between">
                    <span className="font-bold text-gray-500">Study Title:</span>
                    <span className="font-medium text-gray-900 max-w-sm text-right">{wizardTitle}</span>
                  </div>
                  <div className="p-3 flex justify-between">
                    <span className="font-bold text-gray-500">Organism:</span>
                    <span className="italic font-medium text-gray-900">{wizardOrganism}</span>
                  </div>
                  <div className="p-3 flex justify-between">
                    <span className="font-bold text-gray-500">Platform:</span>
                    <span className="text-gray-900">{wizardPlatform}</span>
                  </div>
                  <div className="p-3 flex justify-between">
                    <span className="font-bold text-gray-500">Submitter:</span>
                    <span className="text-gray-900">{wizardSubmitterName} ({wizardEmail})</span>
                  </div>
                  <div className="p-3 flex justify-between">
                    <span className="font-bold text-gray-500">Attached Data Files:</span>
                    <span className="font-bold text-emerald-700">{wizardFiles.length} files staged</span>
                  </div>
                </div>

                {/* THE MAIN ACTION BUTTON: SUBMIT TO NCBI */}
                <div className="pt-2">
                  <button
                    onClick={handleCompleteSubmission}
                    disabled={isSubmitting}
                    className="w-full bg-[#184175] hover:bg-blue-800 text-white font-bold py-3 px-4 rounded-lg shadow-md transition flex items-center justify-center space-x-2 text-sm"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Verifying &amp; Registering Accession at NCBI...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 text-emerald-300" />
                        <span>Submit Data to NCBI Repository</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex justify-start">
                  <button
                    onClick={() => setWizardStep(3)}
                    disabled={isSubmitting}
                    className="text-gray-500 hover:text-gray-800 text-xs font-semibold"
                  >
                    &larr; Back to edit files
                  </button>
                </div>
              </div>
            )}

            {/* SUBMISSION CONFIRMATION SUCCESS VIEW */}
            {submittedAccession && (
              <div className="text-center py-4 space-y-4 text-xs">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                
                <div className="space-y-1">
                  <h4 className="text-xl font-extrabold text-gray-900">
                    Submission Successfully Received!
                  </h4>
                  <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
                    Your {wizardTool} dataset has been queued for standard NCBI automated curation and accession indexing.
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg max-w-md mx-auto space-y-2">
                  <span className="text-gray-600 font-bold block uppercase text-[10px] tracking-wider">
                    Assigned NCBI Accession Number
                  </span>
                  <div className="font-mono text-xl font-black text-blue-900 tracking-wider">
                    {submittedAccession}
                  </div>
                  <div className="flex items-center justify-center space-x-2 pt-1">
                    <button
                      onClick={() => copyToClipboard(submittedAccession)}
                      className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-1 rounded text-[11px] font-bold shadow-2xs flex items-center space-x-1"
                    >
                      <Copy className="w-3 h-3 text-blue-600" />
                      <span>{copiedCmd === submittedAccession ? 'Copied!' : 'Copy Accession'}</span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
                  <button
                    onClick={() => {
                      setSubmitPortalTab('my_submissions');
                      setIsWizardOpen(false);
                      navigateTo('submission');
                    }}
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded text-xs shadow transition"
                  >
                    View in My Submissions &rarr;
                  </button>
                  <button
                    onClick={() => setIsWizardOpen(false)}
                    className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold px-5 py-2.5 rounded text-xs transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* LOGIN MODAL */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative text-gray-900">
            <button onClick={() => setIsLoginModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            <div className="mb-4 text-center">
              <div className="bg-blue-900 text-white font-black w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 text-xl shadow">NIH</div>
              <h3 className="text-lg font-bold">Sign in to NCBI Account</h3>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); if (!loginEmail) return; setIsLoggedIn(true); setUsername(loginEmail.split('@')[0]); setIsLoginModalOpen(false); }} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Email or Username</label>
                <input type="text" required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="e.g., researcher@nih.gov" className="w-full text-sm border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Password</label>
                <input type="password" required value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="••••••••" className="w-full text-sm border rounded px-3 py-2" />
              </div>
              <button type="submit" className="w-full bg-[#184175] hover:bg-blue-800 text-white text-sm font-semibold py-2 rounded shadow transition">Sign In</button>
            </form>
          </div>
        </div>
      )}

      {/* PORTAL MODALS FOR HOME PAGE */}
      {activePortalModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full p-6 relative text-gray-900 space-y-4">
            <button onClick={() => setActivePortalModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            <h3 className="text-lg font-bold capitalize">NCBI {activePortalModal} Portal</h3>
            <p className="text-xs text-gray-600">Accessing dedicated NCBI workflow for {activePortalModal}.</p>
            <div className="flex justify-end pt-3 border-t">
              <button onClick={() => setActivePortalModal(null)} className="px-4 py-2 bg-blue-600 text-white rounded text-xs font-semibold">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          AUTHENTIC NCBI FOOTER (Matching screenshot)
         ========================================================================= */}
      <footer className="mt-auto">
        <div className="bg-[#184175] text-white py-3 px-4 text-center font-bold text-sm tracking-wider uppercase shadow-inner">
          FOLLOW NCBI
        </div>
        <div className="bg-[#cbd5e1] text-gray-800 py-4 px-4">
          <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-6 text-xs font-medium">
            <a href="#" className="hover:text-blue-900">𝕏 (Twitter)</a>
            <a href="#" className="hover:text-blue-900">Facebook</a>
            <a href="#" className="hover:text-blue-900">LinkedIn</a>
            <a href="#" className="hover:text-blue-900">GitHub</a>
            <a href="#" className="hover:text-blue-900">RSS Feeds</a>
          </div>
        </div>
        <div className="bg-[#184175] text-blue-100 py-8 px-4 text-xs">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 border-b border-blue-800 pb-6 mb-6">
            <div>
              <h4 className="font-bold text-white mb-2 uppercase tracking-wider">Connect with NLM</h4>
              <p className="text-blue-200 mb-3">National Library of Medicine</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-2 uppercase tracking-wider">National Library of Medicine</h4>
              <p className="text-blue-200">8600 Rockville Pike</p>
              <p className="text-blue-200">Bethesda, MD 20894</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-2 uppercase tracking-wider">Web Policies</h4>
              <ul className="space-y-1 text-blue-200">
                <li><a href="#" className="hover:underline">Privacy Policy</a></li>
                <li><a href="#" className="hover:underline">FOIA</a></li>
                <li><a href="#" className="hover:underline">HHS Vulnerability Disclosure</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-2 uppercase tracking-wider">Support</h4>
              <ul className="space-y-1 text-blue-200">
                <li><a href="#" className="hover:underline">Help &amp; Documentation</a></li>
                <li><a href="#" className="hover:underline">Accessibility</a></li>
                <li><a href="#" className="hover:underline">Careers</a></li>
              </ul>
            </div>
          </div>
          <div className="max-w-7xl mx-auto text-center text-blue-300 space-y-2">
            <div className="flex flex-wrap items-center justify-center space-x-3 font-semibold text-white">
              <a href="#" className="hover:underline">NLM</a>
              <span>|</span>
              <a href="#" className="hover:underline">NIH</a>
              <span>|</span>
              <a href="#" className="hover:underline">HHS</a>
              <span>|</span>
              <a href="#" className="hover:underline">USA.gov</a>
            </div>
            <p className="text-[11px] text-blue-300">
              National Center for Biotechnology Information &bull; U.S. National Library of Medicine &bull; National Institutes of Health
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
