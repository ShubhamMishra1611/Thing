/* Equation of the Day — add or edit entries here.
   Each entry: { name, title, tex, desc }
   tex uses KaTeX syntax (LaTeX math). */

const EQUATIONS = [
  {
    name: 'Gaussian Process',
    title: 'Gaussian Process Prior',
    tex: 'f(\\mathbf{x}) \\sim \\mathcal{GP}\\bigl(m(\\mathbf{x}),\\, k(\\mathbf{x}, \\mathbf{x}\')\\bigr)',
    desc: 'A distribution over functions. Any finite collection of function values follows a joint Gaussian. The mean function m(x) encodes prior belief; the kernel k(x,x\') encodes similarity — how much knowing f at x tells you about f at x\'.'
  },
  {
    name: 'Bayes\' Theorem',
    title: 'Bayes\' Theorem',
    tex: 'P(H \\mid E) = \\frac{P(E \\mid H)\\, P(H)}{P(E)}',
    desc: 'The posterior probability of hypothesis H given evidence E equals the likelihood times the prior, normalised. The entire discipline of Bayesian inference is the art of choosing P(H) honestly and computing this update repeatedly.'
  },
  {
    name: 'Shannon Entropy',
    title: 'Shannon Information Entropy',
    tex: 'H(X) = -\\sum_{x} p(x) \\log p(x)',
    desc: 'The average surprise (information) in a random variable X. A uniform distribution maximises entropy; a deterministic outcome has zero entropy. It is the theoretical lower bound on average code length — you cannot compress below it.'
  },
  {
    name: 'KL Divergence',
    title: 'Kullback–Leibler Divergence',
    tex: 'D_{\\mathrm{KL}}(P \\| Q) = \\sum_x P(x) \\log \\frac{P(x)}{Q(x)}',
    desc: 'How many extra bits, on average, you waste by encoding samples from P using a code designed for Q. It is not symmetric — D(P‖Q) ≠ D(Q‖P). It appears in every variational method and the training objective of diffusion models.'
  },
  {
    name: 'Softmax',
    title: 'Softmax Function',
    tex: '\\sigma(\\mathbf{z})_i = \\frac{e^{z_i}}{\\sum_{j} e^{z_j}}',
    desc: 'Turns a vector of raw scores into a probability distribution. The exponential amplifies differences, making the largest logit dominate. Temperature scaling (dividing z by T) controls how "peaked" the distribution is.'
  },
  {
    name: 'Scaled Dot-Product Attention',
    title: 'Transformer Attention',
    tex: '\\text{Attention}(Q, K, V) = \\text{softmax}\\!\\left(\\frac{QK^\\top}{\\sqrt{d_k}}\\right)V',
    desc: 'Each query vector Q attends to all key vectors K, producing weights that select a blend of values V. Dividing by √d_k prevents the dot products from growing too large in high dimensions, which would push softmax into saturation.'
  },
  {
    name: 'Normal Distribution',
    title: 'Gaussian (Normal) Distribution',
    tex: 'f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}}\\exp\\!\\left(-\\frac{(x-\\mu)^2}{2\\sigma^2}\\right)',
    desc: 'The bell curve. It emerges naturally from the Central Limit Theorem — the sum of many independent random variables converges to Gaussian regardless of their original distributions. Two parameters, μ (mean) and σ (standard deviation), describe it completely.'
  },
  {
    name: 'Euler\'s Identity',
    title: 'Euler\'s Identity',
    tex: 'e^{i\\pi} + 1 = 0',
    desc: 'Often called the most beautiful equation in mathematics. It links five fundamental constants — e (natural log base), i (imaginary unit), π (circle ratio), 1 (multiplicative identity), and 0 (additive identity) — in a single line.'
  },
  {
    name: 'Fourier Transform',
    title: 'Continuous Fourier Transform',
    tex: '\\hat{f}(\\xi) = \\int_{-\\infty}^{\\infty} f(x)\\, e^{-2\\pi i x \\xi}\\, dx',
    desc: 'Decomposes a signal into its constituent frequencies. Every function is a (possibly infinite) sum of sinusoids. Multiplying in the frequency domain is convolution in the time domain — this is why FFT-based algorithms are so fast.'
  },
  {
    name: 'Cross-Entropy Loss',
    title: 'Cross-Entropy Loss',
    tex: '\\mathcal{L} = -\\sum_{c} y_c \\log \\hat{p}_c',
    desc: 'The standard classification loss. It measures the average bits needed to encode the true label distribution y using the model\'s predicted distribution p̂. Minimising cross-entropy is equivalent to maximising the log-likelihood under the model.'
  },
  {
    name: 'LoRA',
    title: 'Low-Rank Adaptation (LoRA)',
    tex: 'W\' = W_0 + \\Delta W = W_0 + BA, \\quad B \\in \\mathbb{R}^{d \\times r},\\; A \\in \\mathbb{R}^{r \\times k}',
    desc: 'Instead of fine-tuning all of W₀, freeze it and learn a low-rank update ΔW = BA where r ≪ min(d,k). For a 7B model, this can reduce trainable parameters by >99%. The insight: weight updates during fine-tuning have low intrinsic rank.'
  },
  {
    name: 'ELBO',
    title: 'Evidence Lower Bound (VAE)',
    tex: '\\mathcal{L} = \\mathbb{E}_{q_{\\phi}(z|x)}[\\log p_{\\theta}(x|z)] - D_{\\mathrm{KL}}(q_{\\phi}(z|x) \\| p(z))',
    desc: 'The VAE training objective. The first term is reconstruction quality — how well can the decoder recover x from z. The second term regularises the latent space toward a simple prior p(z). Maximising ELBO simultaneously learns compression and generation.'
  },
  {
    name: 'Gradient Descent',
    title: 'Gradient Descent Update',
    tex: '\\theta_{t+1} = \\theta_t - \\eta \\nabla_\\theta \\mathcal{L}(\\theta_t)',
    desc: 'The workhorse of all neural network training. Move parameters θ a small step η (learning rate) in the direction opposite to the gradient. The learning rate is the most consequential hyperparameter — too large and you diverge, too small and training stalls.'
  },
  {
    name: 'Singular Value Decomposition',
    title: 'Singular Value Decomposition',
    tex: 'M = U \\Sigma V^\\top',
    desc: 'Every matrix M factors into an orthogonal rotation U, a scaling Σ (diagonal, non-negative), and another rotation Vᵀ. The singular values reveal the "effective rank" of a transformation. Truncating small singular values gives the best low-rank approximation (Eckart–Young theorem).'
  },
  {
    name: 'Navier–Stokes',
    title: 'Navier–Stokes (Incompressible)',
    tex: '\\rho\\left(\\frac{\\partial \\mathbf{u}}{\\partial t} + \\mathbf{u} \\cdot \\nabla \\mathbf{u}\\right) = -\\nabla p + \\mu \\nabla^2 \\mathbf{u} + \\mathbf{f}',
    desc: 'Governs the motion of viscous, incompressible fluids. The left side is inertia (mass × acceleration). The right side: pressure gradient, viscous diffusion, and external forces. Turbulence — still not fully understood — lives in the non-linear u·∇u term.'
  },
  {
    name: 'PageRank',
    title: 'PageRank',
    tex: 'PR(u) = \\frac{1-d}{N} + d \\sum_{v \\in B_u} \\frac{PR(v)}{L(v)}',
    desc: 'Google\'s original ranking algorithm. A page\'s rank is a weighted sum of the ranks of pages that link to it, normalised by their out-degree. The damping factor d≈0.85 models a random surfer who occasionally jumps to a random page rather than following a link.'
  },
  {
    name: 'Boltzmann Entropy',
    title: 'Boltzmann Entropy',
    tex: 'S = k_B \\ln \\Omega',
    desc: 'Entropy S is proportional to the logarithm of Ω — the number of microstates consistent with the observed macrostate. This equation, carved on Boltzmann\'s tombstone, bridges the microscopic world of atoms to the macroscopic world of heat and work.'
  },
  {
    name: 'Taylor Series',
    title: 'Taylor Series Expansion',
    tex: 'f(x) = \\sum_{n=0}^{\\infty} \\frac{f^{(n)}(a)}{n!}(x-a)^n',
    desc: 'Any smooth function can be approximated near a point a by an infinite polynomial built from its derivatives. This is why linear approximations (n=1) work locally for everything, and why higher-order optimisers like Newton\'s method use the Hessian (n=2).'
  },
  {
    name: 'Jensen\'s Inequality',
    title: 'Jensen\'s Inequality',
    tex: '\\varphi\\bigl(\\mathbb{E}[X]\\bigr) \\leq \\mathbb{E}\\bigl[\\varphi(X)\\bigr]',
    desc: 'For any convex function φ, the function of the expectation is at most the expectation of the function. This single inequality underlies the ELBO derivation in VAEs, the EM algorithm, and most information-theoretic bounds in machine learning.'
  },
  {
    name: 'Cauchy–Schwarz',
    title: 'Cauchy–Schwarz Inequality',
    tex: '|\\langle u, v \\rangle|^2 \\leq \\langle u, u \\rangle \\cdot \\langle v, v \\rangle',
    desc: 'The inner product of two vectors cannot exceed the product of their norms. Cosine similarity — the backbone of embedding-based retrieval — is exactly the normalised inner product bounded to [−1, 1] by this inequality.'
  },
  {
    name: 'Schrödinger Equation',
    title: 'Time-Dependent Schrödinger Equation',
    tex: 'i\\hbar \\frac{\\partial}{\\partial t}\\Psi = \\hat{H}\\Psi',
    desc: 'The fundamental equation of quantum mechanics. ψ is the wavefunction — its squared magnitude gives probability densities. Ĥ is the Hamiltonian operator (total energy). The equation is linear, which is why quantum states can superpose.'
  },
  {
    name: 'Central Limit Theorem',
    title: 'Central Limit Theorem',
    tex: '\\sqrt{n}\\,\\frac{\\bar{X}_n - \\mu}{\\sigma} \\xrightarrow{d} \\mathcal{N}(0, 1)',
    desc: 'The sum of n independent, identically distributed random variables with mean μ and variance σ² converges in distribution to a Gaussian as n→∞. This is why Gaussian assumptions are so common — they are often the asymptotic truth.'
  },
  {
    name: 'Eigenvalue Equation',
    title: 'Eigenvalue Equation',
    tex: 'A\\mathbf{v} = \\lambda \\mathbf{v}',
    desc: 'A linear transformation A leaves certain vectors v unchanged in direction — only scaling them by λ. These are eigenvectors; λ are eigenvalues. PCA, spectral graph theory, Google\'s PageRank, and quantum mechanics are all built on this equation.'
  },
  {
    name: 'Logistic Function',
    title: 'Logistic (Sigmoid) Function',
    tex: '\\sigma(x) = \\frac{1}{1 + e^{-x}}',
    desc: 'Maps any real number to (0,1), making it natural for probabilities. Its derivative is σ(x)(1−σ(x)) — clean and self-referential. Despite being largely replaced by ReLU in hidden layers, it remains the canonical output activation for binary classification.'
  },
  {
    name: 'Law of Total Probability',
    title: 'Law of Total Probability',
    tex: 'P(B) = \\sum_{i} P(B \\mid A_i)\\, P(A_i)',
    desc: 'If events A₁, A₂, … partition the sample space, then the probability of B can be decomposed as a weighted sum over each partition. This is the machinery behind marginalisation in Bayesian networks and the denominator of Bayes\' theorem.'
  }
];
