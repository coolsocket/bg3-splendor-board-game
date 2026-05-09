import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ts from 'typescript';
import { parseArgs } from 'util';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '../../..');

const log = (msg, color = '\x1b[36m') => console.log(`\x1b[1m${color}${msg}\x1b[0m`);
const warn = (msg) => console.log(`\x1b[33m⚠️  ${msg}\x1b[0m`);
const error = (msg) => console.log(`\x1b[31m❌  ${msg}\x1b[0m`);

// --- CONFIGURATION ---
const LAYER_RULES = {
    'src/domain': {
        prohibited: ['react', 'zustand', 'framer-motion', '../store', '../components', '../hooks'],
        description: 'Brain Layer'
    },
    'src/store': {
        prohibited: ['../components', '../hooks'],
        description: 'Heart Layer'
    }
};

// --- AST ENGINE ---
function getSourceFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    return ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true);
}

function walkFiles(dir, extensions = ['.tsx', '.ts']) {
    let results = [];
    if (!fs.existsSync(dir)) return results;
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const fullPath = path.resolve(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) results = results.concat(walkFiles(fullPath, extensions));
        else if (extensions.some(ext => file.endsWith(ext))) results.push(fullPath);
    });
    return results;
}

/**
 * Extracts all imports using AST
 */
function getImports(sourceFile) {
    const imports = [];
    function visit(node) {
        if (ts.isImportDeclaration(node)) {
            const moduleName = node.moduleSpecifier.getText(sourceFile).replace(/['"]/g, '');
            imports.push(moduleName);
        }
        ts.forEachChild(node, visit);
    }
    visit(sourceFile);
    return imports;
}

/**
 * Finds hardcoded hex colors inside strings using AST
 */
function findHardcodedColors(sourceFile) {
    const colors = [];
    function visit(node) {
        if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
            const text = node.text;
            const matches = text.match(/#[0-9a-fA-F]{3,6}\b/g);
            if (matches) matches.forEach(m => colors.push({ val: m, pos: node.getStart() }));
        }
        ts.forEachChild(node, visit);
    }
    visit(sourceFile);
    return colors;
}

// --- COMMANDS ---

function verify() {
    log('⚖️  ARCHITECTURAL POLICE (AST MODE)');
    let violations = 0;
    Object.entries(LAYER_RULES).forEach(([dir, rule]) => {
        const files = walkFiles(path.join(ROOT, dir));
        files.forEach(file => {
            const sf = getSourceFile(file);
            const imps = getImports(sf);
            rule.prohibited.forEach(bad => {
                if (imps.some(i => i === bad || i.startsWith(bad + '/'))) {
                    error(`${path.relative(ROOT, file)}: Prohibited import '${bad}'`);
                    violations++;
                }
            });
        });
    });
    if (violations === 0) log('✅ Perfect Layer Decoupling.', '\x1b[32m');
}

function auditColors() {
    log('🎨 VISUAL AUDITOR (AST MODE)');
    const files = walkFiles(path.join(ROOT, 'src/components'), ['.tsx']);
    let total = 0;
    files.forEach(file => {
        const sf = getSourceFile(file);
        const colors = findHardcodedColors(sf);
        if (colors.length > 0) {
            warn(`${path.relative(ROOT, file)}: ${colors.length} hardcoded colors found.`);
            total += colors.length;
        }
    });
    log(`\n🔍 Total Issues: ${total}`, total === 0 ? '\x1b[32m' : '\x1b[31m');
}

function runSync() {
    log('🔄 SYNCING REPOSITORY KNOWLEDGE GRAPH...');
    const components = walkFiles(path.join(ROOT, 'src/components'), ['.tsx']);
    const graph = {};

    components.forEach(file => {
        const sf = getSourceFile(file);
        const name = path.basename(file, '.tsx');
        graph[name] = {
            path: path.relative(ROOT, file),
            dependencies: getImports(sf).filter(i => i.includes('store/') || i.includes('domain/')),
            hasHardcodedColors: findHardcodedColors(sf).length > 0
        };
    });

    const graphPath = path.join(ROOT, 'docs/knowledge_graph.json');
    fs.writeFileSync(graphPath, JSON.stringify(graph, null, 2));
    log(`✅ Knowledge graph updated at ${path.relative(ROOT, graphPath)}`, '\x1b[32m');
}

async function main() {
    const options = {
        verify: { type: 'boolean' },
        audit: { type: 'boolean' },
        sync: { type: 'boolean' },
        digest: { type: 'boolean' }
    };
    const { values, positionals } = parseArgs({ args: process.argv.slice(2), options, allowPositionals: true });

    const cmd = positionals[0];
    switch (cmd) {
        case 'verify': verify(); break;
        case 'audit': auditColors(); break;
        case 'sync': runSync(); break;
        case 'digest': 
            console.log('--- BG3 Vitals ---');
            console.log(`Components: ${walkFiles(path.join(ROOT, 'src/components'), ['.tsx']).length}`);
            break;
        default:
            console.log('Usage: bg3-ops [verify | audit | sync | digest]');
    }
}

main();