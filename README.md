🧪 Princípios de Testes de Software e Code Smells
Este repositório contém exemplos práticos e documentação sobre princípios de testes de software e identificação de code smells em testes, baseado no livro "Engenharia de Software Moderna" e outras fontes especializadas.

📚 Conteúdo
1. Princípios FIRST de Testes
🚀 F - Fast (Rápidos)
Testes devem executar rapidamente para permitir feedback contínuo.

Exemplo Incorreto:

typescript
// Teste lento - acessa banco de dados real
it("should save user to database", async () => {
  const db = new DatabaseConnection(); // Conexão real
  await db.connect();
  // ... teste lento
});
Exemplo Correto:

typescript
// Teste rápido - usa mock
it("should save user", async () => {
  const mockRepository = { save: vitest.fn() };
  // ... teste rápido com mock
});
🔒 I - Isolated (Isolados)
Testes não devem depender uns dos outros.

🔄 R - Repeatable (Reproduzíveis)
Mesmos resultados em qualquer ambiente.

✅ S - Self-Validating (Auto-validáveis)
Resultado binário (passa/falha) sem interpretação manual.

📊 T - Thorough (Abrangentes)
Cobrir casos de sucesso, erro e edge cases.

2. Code Smells em Testes
🕵️ Mystery Guest (Convidado Misterioso)
Dados de teste definidos fora do teste.

Smell:

typescript
const USER_DATA = { /* dados distantes */ }; // ❌

it("should validate", () => {
  validateUser(USER_DATA); // Dificil de entender
});
Correção:

typescript
it("should validate", () => {
  const userData = { /* dados locais */ }; // ✅
  validateUser(userData);
});
📝 Test Code Duplication (Duplicação)
Código repetido entre testes.

Smell:

typescript
it("test1", () => {
  const cart = new Cart(); // ❌ Duplicado
});

it("test2", () => {
  const cart = new Cart(); // ❌ Duplicado
});
Correção:

typescript
let cart: Cart;

beforeEach(() => {
  cart = new Cart(); // ✅ Setup centralizado
});
🍃 Fragile Test (Teste Frágil)
Quebram com mudanças irrelevantes.

Smell:

typescript
expect(user).toEqual({ // ❌ Muito específico
  id: 1, name: "John", email: "john@example.com"
});
Correção:

typescript
expect(user).toMatchObject({ // ✅ Flexível
  name: "John", email: "john@example.com"
});
🌫️ Obscure Test (Teste Obscuro)
Difícil de entender.

Smell:

typescript
const result = input.replace(/\D/g, '').split('') // ❌ Complexo
Correção:

typescript
const numbers = extractNumbers(input); // ✅ Claro
🔀 Conditional Test Logic
If/else dentro de testes.

Smell:

typescript
if (user.type === "admin") { // ❌ Condicional
  expect(permissions).toContain("delete");
}
Correção:

typescript
// ✅ Testes separados
it("admin should have delete", () => { ... });
it("user should not have delete", () => { ... });
🤯 Eager Test (Teste Ansioso)
Muitas verificações em um teste.

Smell:

typescript
it("should do everything", () => { // ❌ Muitas responsabilidades
  expect(result1).toBe(...);
  expect(result2).toBe(...);
  expect(result3).toBe(...);
});
Correção:

typescript
// ✅ Testes focados
it("should do task1", () => { ... });
it("should do task2", () => { ... });
🛠️ Boas Práticas
📋 Pirâmide de Testes
typescript
// 🏗️  Unit Tests (Muitos)
describe("Calculator", () => {
  it("should add numbers", () => { ... });
});

// 🔗 Integration Tests (Alguns)  
describe("User Registration", () => {
  it("should register and send email", () => { ... });
});

// 🌐 E2E Tests (Poucos)
describe("Checkout Flow", () => {
  it("should complete purchase", () => { ... });
});
🏷️ Nomenclatura Clara
❌ Evitar:

typescript
it("test1", () => { ... });
it("works", () => { ... });
✅ Preferir:

typescript
it("should return error when email is invalid", () => { ... });
it("should calculate total with discount", () => { ... });
🎯 Test Data Builders
typescript
// Builder pattern para dados de teste
const user = new UserBuilder()
  .withEmail("test@email.com")
  .withName("John")
  .build();
📈 Métricas de Cobertura
Linhas: % de linhas executadas

Branches: % de ramificações testadas (if/else)

Functions: % de funções/métodos chamados

Meta Recomendada: >80% de cobertura

🔧 Ferramentas Recomendadas
ESLint: Identifica padrões problemáticos

SonarQube: Análise estática de qualidade

Jest/Vitest: Relatórios de cobertura integrados

Testing Library: Melhores práticas para testes de UI

🚀 Como Usar Este Repositório
Explore os exemplos de code smells e boas práticas

Execute os testes para ver os princípios em ação:

bash
npm test
Verifique a cobertura:

bash
npm run test:coverage
Analise o relatório HTML:

bash
npm run coverage:html
📖 Fontes
Principal: "Engenharia de Software Moderna" - Seção 8.3

Complementares:

Martin, R. "Clean Code"

Fowler, M. "Refactoring"

Meszaros, xUnit Patterns

Documentação Jest/Vitest

🤝 Contribuições
Contribuições são bem-vindas! Sinta-se à vontade para:

Adicionar novos exemplos de code smells

Melhorar a documentação

Sugerir boas práticas adicionais

📄 Licença
Este projeto é destinado para fins educacionais com base em materiais de referência da área de engenharia de software.