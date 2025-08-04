import { useEffect } from "react";
import { Link } from "react-router-dom";
import mermaid from "mermaid";
import PageLayout from "../components/PageLayout";

const codePy = `from open_clip import create_model_and_transforms
import torch
import numpy as np

# Load model and preprocessing transforms
MODEL_NAME = "hf-hub:imageomics/bioclip"
model, _, preprocess = create_model_and_transforms(MODEL_NAME)

# Move model to appropriate device
device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
model = model.to(device)

# L2 normalization
def l2_normalize(x):
    norm = np.linalg.norm(x)
    return x / norm if norm > 0 else x

# Preprocess and encode an image using input model
def encode_image(image, preprocess, model, device):
    image_input = preprocess(image).unsqueeze(0).to(device)
    with torch.no_grad():
        image_features = model.encode_image(image_input)

    embedding = image_features[0].cpu().numpy()

    embedding_norm = l2_normalize(embedding)

    return embedding_norm.tolist()

# Preprocess and encode the image
def get_embedding(image):
    with torch.no_grad():
        query_embedding = np.array(encode_image(image=image, preprocess=preprocess, model=model, device=device))
        return l2_normalize(query_embedding).tolist()`;

const codeDocker = `# Use the official AWS Lambda base image for Python 3.12
FROM public.ecr.aws/lambda/python:3.12

# Install dependencies
RUN pip install -r requirements.txt --target "\${LAMBDA_TASK_ROOT}"

# Copy your Lambda handler code
COPY handler.py \${LAMBDA_TASK_ROOT}

# Set the CMD to your handler function name as defined in lambda.py
CMD ["handler.lambda_handler"]`;

export const ecologistPostPreview = [
  "In this post, we show how to build a serverless wildlife image search application ",
  "that helps users identify flora and fauna in Southeast Asia. By combining BioCLIP ",
  "embeddings, MongoDB Atlas' vector search, and a serverless backend powered by ",
  "AWS Lambda and API Gateway, this architecture supports real-time image queries ",
  "and returns the 5 closest scientific matches from a curated dataset."
].join('');

export default function EcologistPost() {
  const base = import.meta.env.BASE_URL || "/";

useEffect(() => {
  mermaid.initialize({
    startOnLoad: true,
    theme: 'default',
    themeVariables: {
      background: '#f8f9fa',
    },
  });

  mermaid.run();

  // Force white background for all Mermaid SVGs after rendering
  const observer = new MutationObserver(() => {
    const svgs = document.querySelectorAll('.mermaid svg');
    svgs.forEach((svg) => {
      svg.style.backgroundColor = '#f8f9fa';
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  return () => observer.disconnect();
}, []);

  return (
    <PageLayout showBackLink={true} className="text-[20px]">
      <article className="prose dark:prose-invert max-w-none">
        <h1 className="text-strong">Building an AI-Powered Wildlife Identifier for Southeast Asia Using BioCLIP, MongoDB Atlas, and Serverless Infrastructure</h1>
        <p className="text-base text-[18px]">
          by Ming Jie Wong · Updated: Aug 01, 2025
          <br />
        </p>
        <blockquote className="text-strong">
          <strong>Explore Southeast Asia's biodiversity</strong> — {" "}
          <a 
            href="https://huggingface.co/spaces/mjwong/ecologist" 
            target="_blank" 
            rel="noreferrer" 
            className="text-strong underline"
          >
            Upload a wildlife photo here ↩
          </a>{" "}
          to see the most visually similar species from the region, matched using an AI model trained on ecological data. No sign-up needed.
        </blockquote>
        <p>
          {ecologistPostPreview}
        </p>
        <p>
          We will walk through the application architecture, and discuss how we can integrate this system 
          with Hugging Face Spaces to deliver a seamless user experience.
        </p>
        <hr />

        <h2 className="text-strong">Problem Statement</h2>
          <h3 className="text-strong">Motivation: Why Build a Biodiversity-Aware Visual Search Engine?</h3>
          <p>
            Modern tools such as Google Lens and Google Image Search allow users to upload a photo and retrieve visually similar
            images using machine learning. While these platforms are excellent for broad, general-purpose visual recognition such as identifying landmarks, pets or commercial products,
            they fall short in <strong className="text-strong">fine-grained, biodiversity-specific</strong> identification tasks where <strong className="text-strong">regional variation</strong>, <strong className="text-strong">scientific taxonomy</strong> and <strong className="text-strong">interpretability</strong> are crucial.
          </p>
          <p>
            <strong><a href="https://huggingface.co/spaces/mjwong/ecologist" target="_blank" rel="noreferrer" className="text-strong">Ecologist ↩</a></strong>, the 
            wildlife identifier described in this post, is designed to bridge this gap by prioritizing ecological specificity, scientific output, and region-aware relevance. Rather than competing with general image search platforms, 
            it complements them by addressing their blind spots in the biodiversity domain.
          </p>

          <h3 className="text-strong">Limitations of General Visual Search</h3>
          <h4>1. No Regional Awareness or Geo-Filtering</h4>
          <p>
            Models like Google Lens are trained on vast but <strong className="text-strong">globally averaged</strong> datasets. They may identify an animal correctly at the species level, but cannot distinguish between <strong className="text-strong">subspecies</strong> or <strong className="text-strong">regional variations</strong>. They
            also do not incorporate country-specific filtering to refine their results, which can lead to less precise identifications for geographically specific organisms.
          </p>
          <div>
            <strong>Example:</strong>
            <p>An image of a Singaporean wild boar (left) could be incorrectly matched with a Eurasian boar from North America (right), demonstrating how general-purpose models may overlook crucial geographic context.</p>
            <div className="flex gap-4 my-4">
              <img src={`${base}boar_sg.jpg`} alt="Wild Boar in Singapore" className="w-1/2 rounded-lg shadow-md" />
              <p>&nbsp;&nbsp;&nbsp;&nbsp;</p>
              <img src={`${base}boar_us.jpg`} alt="Eurasian Boar" className="w-1/2 rounded-lg shadow-md" />
            </div>
          </div>
          <p className="text-center italic text-[15px] mt-2">
            Photos by{' '}
            <a href="https://www.inaturalist.org/observations/150701749" target="_blank" rel="noreferrer" className="text-current no-underline hover:underline">
              Monique Cordeiro
            </a>{' '}
            and{' '}
            <a href="https://www.pexels.com/photo/boar-in-a-park-18161206/" target="_blank" rel="noreferrer" className="text-current no-underline hover:underline">
              Juan Felipe Ramirez
            </a>
            .
          </p>
            <table className="w-full border-separate border-spacing-x-0 border-spacing-y-2">
            <thead>
              <tr>
                <th className="text-left p-3 text-base font-semibold border-b-2 border-slate-400 dark:border-slate-600"><strong>Tool</strong></th>
                <th className="text-left p-3 text-base font-semibold border-b-2 border-slate-400 dark:border-slate-600"><strong>Output</strong></th>
              </tr>
            </thead>
            <tbody className="align-top text-[17px] leading-7 tracking-[0.005em]">
              <tr>
                <td className="text-left p-4 whitespace-nowrap"><strong>Google Lens&nbsp;&nbsp;</strong></td>
                <td className="text-left p-4">Matches from various regions, including domestic pigs and non-local wild boars</td>
              </tr>
              <tr>
                <td className="text-left p-4"><strong>Ecologist</strong></td>
                <td className="text-left p-4"><i>Sus scrofa vittatus</i>, Southeast Asian subspecies; five ecologically relevant photo matches from Singapore</td>
              </tr>
            </tbody>
            </table>
          <p>
            This lack of ecological context undermines accuracy. Species with the same name often differ in visual traits across habitats, making country-specific filtering essential for scientific and conservation use cases.
          </p>

          <h4>2. Embeddings Not Tuned for Biological Semantics</h4>
          <p>
            General vision models like CLIP and ViT are powerful for many tasks because they learn from massive, diverse datasets. However, they are not optimized for the complexities of biodiversity. Their global training often 
            prevents them from:
            <ul>
              <li>Accurately telling apart very similar species, such as different types of birds or butterflies.</li>
              <li>Grouping images based on important biological characteristics like petal shape or wing patterns.</li>
            </ul>
            In contrast, BioCLIP, the model powering Ecologist, was specifically trained for biological tasks. By using millions of expert-labeled observations from sources like <strong className="text-strong"><a href="https://www.inaturalist.org/" target="_blank" rel="noreferrer" className="text-current">iNaturalist ↩</a></strong>, BioCLIP is uniquely able to:
            <ul>
              <li>Make more precise taxonomic identifications.</li>
              <li>Recognize and learn from key ecological features.</li>
              <li>Provide a much higher level of accuracy when identifying various species of plants, animals, and fungi.</li>
            </ul>
          </p>
          <h4>3. Lack of Explainability and Scientific Metadata</h4>
          <p>
            Google Lens returns a best guess, but does not offer:
            <ul>
              <li>Confidence or similarity scores</li>
              <li>Taxonomic lineage (e.g., Kingdom &rarr; Phylum &rarr; Class)</li>
              <li>Reference images for comparison</li>
            </ul>
            This makes it difficult to use in research, education, or citizen science settings where explainability, trust, and reproducibility matter.
          </p>

          <h3 className="text-strong">Value Proposition</h3>
          <table className="w-full border-separate border-spacing-x-0 border-spacing-y-2">
            <thead>
              <tr>
                <th className="text-left p-3 text-base font-semibold border-b-2 border-slate-400 dark:border-slate-600"><strong className="text-strong">Feature</strong></th>
                <th className="text-left p-3 text-base font-semibold border-b-2 border-slate-400 dark:border-slate-600"><strong className="text-strong">Google Lens</strong></th>
                <th className="text-left p-3 text-base font-semibold border-b-2 border-slate-400 dark:border-slate-600"><strong className="text-strong">Ecologist</strong></th>
              </tr>
            </thead>
            <tbody className="align-top text-[17px] leading-7 tracking-[0.005em]">
              <tr>
                <td className="text-left p-4"><strong className="text-strong">Visual species match</strong></td>
                <td className="text-left p-4">✅</td>
                <td className="text-left p-4">✅</td>
              </tr>
              <tr>
                <td className="text-left p-4"><strong className="text-strong">Regional filtering (e.g. by country)</strong></td>
                <td className="text-left p-4">❌</td>
                <td className="text-left p-4">✅</td>
              </tr>
              <tr>
                <td className="text-left p-4"><strong className="text-strong">Biology-tuned embeddings (BioCLIP)</strong></td>
                <td className="text-left p-4">❌</td>
                <td className="text-left p-4">✅</td>
              </tr>
              <tr>
                <td className="text-left p-4"><strong className="text-strong">Similarity scoring and ranked results</strong></td>
                <td className="text-left p-4">❌</td>
                <td className="text-left p-4">✅</td>
              </tr>
              <tr>
                <td className="text-left p-4"><strong className="text-strong">Taxonomic breakdown (e.g., Class &rarr; Genus)</strong></td>
                <td className="text-left p-4">❌</td>
                <td className="text-left p-4">✅</td>
              </tr>
              <tr>
                <td className="text-left p-4"><strong className="text-strong">Explainable results (reference images)</strong></td>
                <td className="text-left p-4">❌</td>
                <td className="text-left p-4">✅</td>
              </tr>
            </tbody>
          </table>
        <hr />

        <h2 className="text-strong">Overview</h2>
        <p>
          <strong className="text-strong">Ecologist</strong> is a wildlife identification application specializing in species from <strong className="text-strong">Southeast Asian countries</strong>, including <strong className="text-strong">Singapore</strong>
          , <strong className="text-strong">Malaysia</strong>, <strong className="text-strong">Thailand</strong>, and <strong className="text-strong">Indonesia</strong>.
        </p>
        <p>
          Unlike general-purpose tools, Ecologist uses a specialized BioCLIP model to provide highly accurate and relevant results. When a user uploads a photo, the app:
        </p>
        <ul>
          <li><strong className="text-strong">Identifies species</strong> by comparing the image against a curated, country-specific database built from iNaturalist observations.</li>
          <li><strong className="text-strong">Ensures precision</strong> by applying geographic filters, so the results are ecologically and regionally accurate.</li>
          <li><strong className="text-strong">Delivers detailed results</strong>, including the scientific and common name, five reference images for visual comparison, and a similarity score.</li>
        </ul>
        <p>
          Hosted on Hugging Face Spaces, Ecologist is free, requires no sign-in, and offers a transparent, scientifically grounded alternative to commercial visual search systems, making it ideal for researchers, educators, and nature enthusiasts.
        </p>
        <hr />

        <h2 className="text-strong">High-Level Architecture</h2>
        <p>Because this is a read-heavy, latency-sensitive retrieval system, image embedding is computed on the frontend to eliminate backend CPU/GPU bottlenecks. 
          The backend is responsible only for performing lightweight vector search using MongoDB Atlas's aggregation framework.
        </p>
        <pre className="mermaid flex items-center justify-center mb-8">
          {`
            graph TD
                A[User Uploads Image on HF Space] --> B[Frontend converts to BioCLIP embedding];
                B --> C[HTTP Request to API Gateway];
                C --> D[Lambda Function - Nearest Neighbor Search];
                D --> E[MongoDB Atlas Vector DB];
                E --> D;
                D --> F[Return Top 5 Matches to Frontend];
          `}
        </pre>
        <p>Everything from API Gateway to MongoDB can be provisioned using <strong className="text-strong">Terraform</strong>, ensuring repeatable infrastructure as code.</p>
        <hr />

        <h2 className="text-strong">Performance & Scaling Characteristics</h2>
          <h3 className="text-strong">Metrics & Usage</h3>
          <p> 
            We track usage based on unique users uploading at least 1 image per session, aligning with standard DAU/WAU/MAU definitions:
          </p>
          <table className="w-full border-separate border-spacing-x-0 border-spacing-y-2">
            <thead>
              <tr>
                <th className="text-left p-3 text-base font-semibold border-b-2 border-slate-400 dark:border-slate-600"><strong className="text-strong">Metric</strong></th>
                <th className="text-left p-3 text-base font-semibold border-b-2 border-slate-400 dark:border-slate-600"><strong className="text-strong">Value</strong></th>
              </tr>
            </thead>
            <tbody className="align-top text-[17px] leading-7 tracking-[0.005em]">
              <tr>
                <td className="text-left p-4"><strong className="text-strong">Monthly Active Users (MAU)</strong></td>
                <td className="text-left p-4">~70</td>
              </tr>
              <tr>
                <td className="text-left p-4"><strong className="text-strong">Weekly Active Users (WAU)</strong></td>
                <td className="text-left p-4">~15</td>
              </tr>
              <tr>
                <td className="text-left p-4"><strong className="text-strong">Daily Active Users (DAU)</strong></td>
                <td className="text-left p-4">~1-2</td>
              </tr>
            </tbody>
          </table>
          <p>
            This level of usage is expected given the experimental nature of the application and limited outreach at this stage.
          </p>
          <p>
            Despite low traffic, the system is designed to handle moderate bursts while keeping cost predictable. A <strong className="text-strong">600-request, 10-RPS load test</strong> against 
            the API (using precomputed/synthetic 512-dimensional embeddings) achieved <strong className="text-strong">p50/p95/p99 latencies of 47/62/94 ms</strong>, 
            with <strong className="text-strong">0% errors</strong> and <strong className="text-strong">no service degradation</strong> observed.
          </p>
          <div className="prose prose-slate max-w-none">
            <blockquote className="text-strong">
              <p><strong>Note:</strong> This measures backend API latency only; end-to-end time seen in the UI also includes client-side embedding and image handling.</p>
            </blockquote>
          </div>

          <h3 className="text-strong">End-to-End Latency</h3>
          <p>
            End-to-end latency is measured from <strong className="text-strong">image upload to the return of top-5 results</strong>, covering:
          <ul>
            <li><strong className="text-strong">Frontend encoding (BioCLIP)</strong></li>
            <li><strong className="text-strong">API Gateway transmission</strong></li>
            <li><strong className="text-strong">AWS Lambda execution</strong></li>
            <li><strong className="text-strong">MongoDB Atlas vector search</strong></li>
            <li><strong className="text-strong">Result formatting</strong></li>
          </ul>
          </p>
          <p>
            Based on manual testing with ~50 image uploads, we observed the following latencies:
          </p>
          <table className="w-full border-separate border-spacing-x-0 border-spacing-y-2">
            <thead>
              <tr>
                <th className="text-left p-3 text-base font-semibold border-b-2 border-slate-400 dark:border-slate-600"><strong className="text-strong">Percentile</strong></th>
                <th className="text-left p-3 text-base font-semibold border-b-2 border-slate-400 dark:border-slate-600"><strong className="text-strong">Latency</strong></th>
              </tr>
            </thead>
            <tbody className="align-top text-[17px] leading-7 tracking-[0.005em]">
              <tr>
                <td className="text-left p-4"><strong className="text-strong">p50</strong></td>
                <td className="text-left p-4">~15 seconds</td>
              </tr>
              <tr>
                <td className="text-left p-4"><strong className="text-strong">p95</strong></td>
                <td className="text-left p-4">~30 seconds</td>
              </tr>
              <tr>
                <td className="text-left p-4"><strong className="text-strong">p100</strong></td>
                <td className="text-left p-4">&gt; 30 seconds (user manually refreshed the browser before any platform timeout)</td>
              </tr>
            </tbody>
          </table>
          <p>
              In cases exceeding 30 seconds, the frontend remained responsive, but we manually refreshed the browser instead of waiting for a system timeout. 
              This behavior reflects a practical user response under slow conditions, rather than platform-imposed limits.
          </p>
          <h3 className="text-strong">Concurrency Strategy</h3>
          <p>
            We keep a small provisioned concurrency pool on AWS Lambda for the following reasons:
          </p>
          <ul>
            <li>To avoid cold starts for our steady, low number of DAUs.</li>
            <li>To absorb minor traffic bursts (e.g., from link shares or classroom demos) without delay.</li>
            <li>To allow AWS Lambda's on-demand concurrency to scale for any overflow traffic.</li>
          </ul>
          <p>
            We also tested the system's ability to withstand a sudden burst of <strong className="text-strong">~200 RPS spike</strong> (36k requests in ~3 minutes 
            with precomputed/synthetic 512-dimensional embeddings) to validate overflow behavior beyond the provisioned concurrency pool. AWS Lambda's on-demand 
            concurrency successfully scaled beyond the warm pool. 
          </p>
          <p>  
            However, the MongoDB Atlas entry-level tier hit its concurrent connection limit. Only <strong className="text-strong">~40%</strong> of requests succeeded, with 
            successful responses returning in <strong className="text-strong">p50/p95/p99 latencies of 0.54/1.63/5.6s</strong>. The remaining requests failed with 429 or 504 
            errors due to MongoDB Atlas connection throttling.
          </p>
          <p>
            This confirmed the compute tier's burst resilience and highlighted the need to size data tier limits in tandem, especially on cost-optimized stacks.
          </p>
        <hr />

        <h2 className="text-strong">System Design Goals and Constraints</h2>
        <table className="w-full border-separate border-spacing-x-0 border-spacing-y-2">
          <thead>
            <tr>
              <th className="text-left p-3 text-base font-semibold border-b-2 border-slate-400 dark:border-slate-600"><strong className="text-strong">Metric</strong></th>
              <th className="text-left p-3 text-base font-semibold border-b-2 border-slate-400 dark:border-slate-600"><strong className="text-strong">Design Rationale</strong></th>
              <th className="text-left p-3 text-base font-semibold border-b-2 border-slate-400 dark:border-slate-600"><strong className="text-strong">Current Implementation</strong></th>
            </tr>
          </thead>
          <tbody className="align-top text-[17px] leading-7 tracking-[0.005em]">
            <tr>
              <td className="text-left p-4"><strong className="text-strong">Latency&nbsp;&nbsp;</strong></td>
              <td className="text-left p-4">
                Keep end-to-end latency below user tolerance thresholds; avoid API Gateway timeouts (504).
                &nbsp;
              </td>
              <td className="text-left p-4">
                Empirically observed p50 = ~15s, p95 = ~30s, with occasional manual refresh beyond 30s. 
                <br />
                Frontend handles BioCLIP embedding.
                <br />
                Backend (Lambda + MongoDB) consistently returns results in ≤ 100ms under normal load.
                <br />
                <br />
              </td>
            </tr>

            <tr>
              <td className="text-left p-4"><strong className="text-strong">Burst Load&nbsp;&nbsp;</strong></td>
              <td className="text-left p-4">
                	Absorb moderate spikes (e.g. 100-200 RPS) without cold starts or degraded responsiveness.
                &nbsp;
              </td>
              <td className="text-left p-4">
                A small provisioned concurrency pool on AWS Lambda is configured to avoid cold starts with overflow handled by on-demand scaling.
                <br />
                On-demand Lambda scaling validated via a 36k-request spike (200 RPS).
                <br />
                <br />
              </td>
            </tr>

            <tr>
              <td className="text-left p-4"><strong className="text-strong">Data Scope&nbsp;&nbsp;</strong></td>
              <td className="text-left p-4">
                	Restrict retrieval to ecologically relevant regions (Singapore, Malaysia, Thailand, Indonesia).
                <br />
                &nbsp;
              </td>
              <td className="text-left p-4">
                Vector search is country-filtered using metadata.
                <br />
                Uses research-grade iNaturalist entries only.
                <br />
                <br />
              </td>
            </tr>

            <tr>
              <td className="text-left p-4"><strong className="text-strong">Error Handling&nbsp;&nbsp;</strong></td>
              <td className="text-left p-4">
                Minimize failure rates and recover gracefully under stress (DB throttling, API limits).
                <br />
                &nbsp;
              </td>
              <td className="text-left p-4">
                Transient error handling (e.g., retries on 429, 504) not yet validated.
                <br />
                MongoDB entry-level tier bottleneck surfaced at high concurrency.
                <br />
                <br />
              </td>
            </tr>

            <tr>
              <td className="text-left p-4"><strong className="text-strong">Cost & Ops&nbsp;&nbsp;</strong></td>
              <td className="text-left p-4">
                Prioritize low-cost, low-maintenance deployment with transparent explainability for end users.
                <br />
                &nbsp;
              </td>
              <td className="text-left p-4">
                Serverless architecture with Hugging Face frontend, API Gateway, Lambda, and MongoDB Atlas entry-level tier (vector index).
                <br />
                Embeddings are L2-normalized; results returned with similarity scores and reference images.
                <br />
                <br />
              </td>
            </tr>

            <tr>
              <td className="text-left p-4"><strong className="text-strong">Reproducibility&nbsp;&nbsp;</strong></td>
              <td className="text-left p-4">
                Ensure deployment is infra-as-code and behaviorally stable.
              </td>
              <td className="text-left p-4">
                Terraform used for provisioning. 
                <br />
                BioCLIP embeddings are version-locked and preprocessing is consistent across frontend and backend.
                <br />
                <br />
              </td>
            </tr>
          </tbody>
        </table>
        <blockquote className="text-strong">
          <p><strong>Note:</strong> The system is optimized for low cost and minimal ops, with client-side embedding and usage-based pricing tiers on MongoDB and AWS. No persistent image storage or GPU servers are used.</p>
        </blockquote>
        <hr />

        <h2 className="text-strong">Embedding Consistency (Drift Prevention)</h2>
        <p>
          In retrieval systems that rely on vector similarity, ensuring that embeddings from ingestion and inference are generated under identical conditions is critical. 
          Mismatches in image preprocessing, model weights, or device behavior (e.g., GPU/CPU divergence) can lead to <strong className="text-strong">distribution shift</strong>, resulting in 
          degraded retrieval accuracy or inconsistent ranking.
        </p>
        <p>
          To avoid this, the application should use a shared, version-locked embedding configuration for both dataset indexing (offline) and query encoding (live). This includes:
        </p>
        <ul>
          <li>Same model checkpoint (BioCLIP)</li>
          <li>Same preprocessing transforms (e.g., resize, crop, normalization)</li>
          <li>Same L2 normalization strategy on output embeddings</li>
        </ul>
        <p>
          Both indexing and query pipelines apply <code class="text-[15px]">encode_image()</code> with identical configuration. This ensures vector comparisons are meaningful and 
          stable across different execution contexts.
        </p>
        <p>
          The application also uses <strong className="text-strong">cosine similarity</strong>, computed as a dot product between <strong className="text-strong">L2-normalized vectors</strong>, to rank candidate embeddings. 
        </p>
        <p>
          This approach is preferred over raw dot product because cosine similarity compares <em>direction</em> rather than <em>magnitude</em>. It effectively measures the angle 
          between vectors on a unit hypersphere, making it <strong className="text-strong">invariant to scale</strong> and robust to variations in embedding norms.
        </p>
        <ul className="list-disc pl-6">
          <li><strong className="text-strong">Dot product</strong> is influenced by vector length, which can distort retrieval if embeddings have inconsistent scales.</li>
          <li><strong className="text-strong">Cosine similarity</strong> focuses on the angle between vectors, which reflects semantic similarity more accurately for normalized embeddings.</li>
          <li>Applying <code className="text-[15px]">l2_normalize()</code> ensures all embeddings have unit length, allowing cosine similarity to be computed efficiently via dot product.</li>
        </ul>

        <details>
          <summary>Sample Code Snippet — Consistent image embedding with BioCLIP</summary>

          <div className="not-prose rounded-lg border-2 border-blue-400 overflow-auto">
            <pre className="bg-white m-0">
              <code className="block font-mono text-[15px] leading-7 text-slate-800">
                {codePy.split('\n').map((line, i) => (
                  <div
                    key={i}
                    className={`px-4 ${i % 2 ? 'bg-gray-100' : 'bg-white'} whitespace-pre`}
                  >
                    {line.length ? line : '\u00A0'}
                  </div>
                ))}
              </code>
            </pre>
          </div>
        </details>

        <p>
          In the current Ecologist implementation, this logic is performed directly in the Hugging Face Spaces frontend, rather than in the backend (i.e., AWS Lambda).
        </p>

        <p>
          This avoids memory overhead of loading BioCLIP inside the Lambda environment and since image embeddings are compact (e.g., 512-dimensional vectors), compared
          to their raw image files, this approach of embedding on the client avoids round-trip serialization of large image data to the backend.
        </p>
        <hr />

        <h2 className="text-strong">Data Model &amp; Indexing (MongoDB Atlas)</h2>
        <p>
          The system stores reference embeddings in separate MongoDB collections for each country. This design reflects the application's UI behavior, where users choose their 
          country before uploading an image, and ensuring <strong className="text-strong">each vector search query is scoped to a single, pre-filtered collection</strong>,
          without requiring joins or post-query filtering.
        </p>
        <p>
          Each document represents a labeled Naturalist observation and includes the following fields:
        </p>
        <ul>
          <li><strong className="text-strong"><code class="text-[15px]">_id</code></strong>: Unique document identifier.</li>
          <li><strong className="text-strong"><code class="text-[15px]">scientific_name</code></strong>, <strong className="text-strong"><code class="text-[15px]">common_name</code></strong>: Taxonomic details.</li>
          <li><strong className="text-strong"><code class="text-[15px]">image_url</code></strong>: Link to the source image.</li>
          <li><strong className="text-strong"><code class="text-[15px]">taxon_id</code></strong>: Metadata for provenance.</li>
          <li><strong className="text-strong"><code class="text-[15px]">embedding</code></strong>: BioCLIP 512-dimensional float vector.</li>
        </ul>
        <p>
          Each collection is indexed using <strong className="text-strong">MongoDB Atlas' native <code class="text-[15px]">knnVector</code></strong> feature with <strong className="text-strong">cosine similarity</strong> and
          an <strong className="text-strong">HNSW-based approximate nearest neighbor (ANN)</strong> index.
        </p>

        <p>
          <strong>Scalability Considerations</strong>
          <p>
            This architecture is designed to scale both <strong className="text-strong">horizontally</strong> and <strong className="text-strong">modularly</strong>:
          </p>
        <ul>
          <li><strong className="text-strong">Per-country collections</strong> isolate query and indexing load, allowing independent scaling and maintenance.</li>
          <li><strong className="text-strong">Query scope is always bounded</strong> to a single collection, improving search efficiency and minimizing index scan overhead.</li>
          <li><strong className="text-strong">Current scale:</strong> Each collection contains ~110,000 to 190,000 vector documents and consistently achieves sub-100ms query latency under normal load.</li>
        </ul>
        <p>
          To support future growth:
        <ul>
          <li><strong className="text-strong">Sharding within each country collection </strong> can be introduced once document counts exceed ~10M per region.</li>
          <li><strong className="text-strong">Sharding by <code className="text-[15px]">taxon_id</code></strong> is recommended to mitigate hotspotting caused by disproportionately common species.</li>
        </ul>
        </p>
          This setup promotes low-latency, high-relevance retrieval with minimal overhead. It also prepares the system for scaling across countries or taxa 
          without rearchitecting the core search logic.
        </p>
        <hr />

        <h2 className="text-strong">AWS Lambda as Backend Query Layer</h2>

        <p>
          The Lambda backend is deployed as a containerized Python application using AWS Lambda's base image (<code class="text-[15px]">public.ecr.aws/lambda/python</code>) and 
          provisioned with Terraform. It implements a minimal query handler backed by MongoDB Atlas vector search.
        </p>

        <hr />

        <h2 className="text-strong">Client-Server Interaction Flow</h2>
        <p>
          The Ecologist frontend is built using Hugging Face Spaces, powered by the Gradio SDK. It handles:
          <ul>
            <li>Image upload and preview.</li>
            <li>On-device BioCLIP embedding using <code class="text-[15px]">open_clip</code>.</li>
            <li>Country selection via a dropdown.</li>
            <li>Sending the embedding and selected country to a secured API endpoint.</li>
          </ul>
          The backend is served by AWS API Gateway, which:
          <ul>
            <li>Exposes the public REST endpoint for embedding-based queries.</li>
            <li>Performs per-country collection vector search against MongoDB Atlas via an AWS Lambda function.</li>
            <li>Returns standardized results including scientific names, common names, similarity scores, and matched image URLs.</li>
          </ul>
          This design keeps the backend stateless and cost-efficient, offloading computation (BioCLIP embedding) to the client, and enabling real-time biodiversity 
          retrieval with minimal infrastructure overhead.
        </p>
        <hr />

        <h2 className="text-strong">Scaling Path Forward</h2>
        <p>
          As usage increases, the architecture can evolve to handle higher throughput, reduce latency, and improve fault tolerance. 
        </p>
        <p>
          Below are the primary bottlenecks identified in the current design, along with scalable upgrade paths:
        </p>
        <table className="w-full border-separate border-spacing-x-0 border-spacing-y-2">
          <thead>
            <tr>
              <th className="text-left p-3 text-base font-semibold border-b-2 border-slate-400 dark:border-slate-600"><strong className="text-strong">Limitation</strong></th>
              <th className="text-left p-3 text-base font-semibold border-b-2 border-slate-400 dark:border-slate-600"><strong className="text-strong">Description</strong></th>
              <th className="text-left p-3 text-base font-semibold border-b-2 border-slate-400 dark:border-slate-600"><strong className="text-strong">Upgrade Path</strong></th>
            </tr>
          </thead>
          <tbody className="align-top text-[17px] leading-7 tracking-[0.005em]">
            <tr>
              <td className="text-left p-4"><strong className="text-strong">API Gateway ~29-30s integration timeout</strong></td>
              <td className="text-left p-4">Long-running queries may exceed API Gateway's 30s timeout, causing user frustration.</td>
              <td className="text-left p-4">Move to <strong className="text-strong">async queue (API Gateway &rarr; SQS &rarr; Lambda fanout)</strong> for long-running queries.</td>
            </tr>
            <tr>
              <td className="text-left p-4"><strong className="text-strong">Frontend-bound embedding</strong></td>
              <td className="text-left p-4">All embedding is currently done on the client, which limits use cases to browser-compatible environments.</td>
              <td className="text-left p-4">Offload embedding to a <strong className="text-strong">hosted GPU inference service</strong> such as <strong className="text-strong">AWS ECS + TorchServe</strong> or <strong className="text-strong">SageMaker Inference</strong>.</td>
            </tr>
            <tr>
              <td className="text-left p-4"><strong className="text-strong">Provisioned concurrency bottleneck</strong></td>
              <td className="text-left p-4">The current warm pool is sized for current DAU and may become a bottleneck with increased DAU.</td>
              <td className="text-left p-4"><strong className="text-strong">Increase Lambda concurrency</strong> or containerize backend on <strong className="text-strong">AWS Fargate</strong> / <strong className="text-strong">AWS ECS</strong>.</td>
            </tr>
            <tr>
              <td className="text-left p-4"><strong className="text-strong">MongoDB Atlas connection limit</strong></td>
              <td className="text-left p-4">Some backend queries failed during spike testing due to exceeded concurrent connection limits on entry-level tier.</td>
              <td className="text-left p-4">Upgrade to a higher MongoDB Atlas tier or reconfigure connection pooling and client reuse for efficiency.</td>
            </tr>
          </tbody>
        </table>
        <hr />

        <h2 className="text-strong">Summary</h2>
        <p>
          This post introduces Ecologist, a serverless AI-powered wildlife search tool for Southeast Asia. Using BioCLIP embeddings, MongoDB Atlas vector search, 
          and AWS Lambda, it delivers country-specific species identification from uploaded images, supporting real-time, explainable results. Optimized for cost, scalability, 
          and scientific relevance, it's deployed on Hugging Face Spaces.
        </p>
        <p><strong className="text-strong">Got questions or want to contribute? Reach out to me on LinkedIn.</strong></p>
        <hr />

        <h2 className="text-strong">References</h2>
        <ol>
          <li>
            <a href="https://arxiv.org/abs/2311.18803" target="_blank" rel="noreferrer" className="text-strong">BioCLIP: A Vision Foundation Model for the Tree of Life ↩</a>
          </li>
          <li>
            <a href="https://www.mongodb.com/docs/atlas/atlas-vector-search/tutorials/vector-search-quick-start/?tck=ai_as_web" target="_blank" rel="noreferrer" className="text-strong">MongoDB Atlas Vector Search Quick Start ↩</a>
          </li>
          <li>
            <a href="https://www.mongodb.com/resources/basics/hierarchical-navigable-small-world" target="_blank" rel="noreferrer" className="text-strong">What is a Hierarchical Navigable Small World? ↩</a>
          </li>
          <li>
            <a href="https://docs.aws.amazon.com/dlami/latest/devguide/tutorial-torchserve.html" target="_blank" rel="noreferrer" className="text-strong">AWS Developer Guide for TorchServe ↩</a>
          </li>
          <li>
            <a href="https://docs.aws.amazon.com/sagemaker/latest/dg/deploy-model.html" target="_blank" rel="noreferrer" className="text-strong">AWS Developer Guide for Deploying Models for Inference in SageMaker ↩</a>
          </li>
        </ol>
      </article>
    </PageLayout>
  );
}